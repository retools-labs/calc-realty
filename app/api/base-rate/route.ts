// 한국은행 ECOS Open API에서 기준금리(통계표 722Y001, 항목코드 0101000 = 한국은행 기준금리)를
// 서버에서 대신 조회해서 내려주는 프록시 라우트.
//
// 왜 서버 라우트로 두나: ECOS 인증키를 브라우저에 노출하지 않기 위해(클라이언트에서 직접 호출하면
// 키가 그대로 드러남) + 응답을 캐싱해서 ECOS 호출 횟수를 아끼기 위해.
//
// 필요 환경변수: ECOS_API_KEY (https://ecos.bok.or.kr/api/ 에서 무료 발급, 가입 즉시~1일 내 사용 가능)
// Vercel 프로젝트 설정 → Environment Variables 에 등록해야 프로덕션에서 동작한다.
// 키가 없거나 ECOS 호출이 실패하면 마지막으로 사람이 확인해둔 값(lib/jeonseConversion.ts의
// FALLBACK_BASE_RATE_PERCENT)으로 조용히 대체하고 stale:true를 내려준다 — 사용자에게는 계산
// 결과가 끊기지 않고, 프론트에서 "실시간 확인 실패" 안내만 보여주는 식으로 우아하게 저하된다.

import { NextResponse } from "next/server";
import { FALLBACK_BASE_RATE_PERCENT, FALLBACK_BASE_RATE_DATE } from "@/lib/jeonseConversion";

export const revalidate = 21600; // 6시간 캐시 — 기준금리는 하루에도 여러 번 바뀔 일이 없다.

const STAT_CODE = "722Y001"; // 한국은행 기준금리 통계표
const ITEM_CODE = "0101000"; // 통계항목코드: 한국은행 기준금리

function formatYmd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function GET() {
  const apiKey = process.env.ECOS_API_KEY;
  const fallback = {
    ratePercent: FALLBACK_BASE_RATE_PERCENT,
    effectiveDate: FALLBACK_BASE_RATE_DATE,
    source: "fallback" as const,
    stale: true,
  };

  if (!apiKey) {
    return NextResponse.json(fallback);
  }

  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 180); // 기준금리 변경 주기(연 8회 회의)에 비해 넉넉한 조회 범위

    // 요청 건수를 넉넉하게(500) 잡아야 한다 — 이 통계는 일별로 값이 갱신되므로 180일 범위면
    // 로우가 150~190개 정도 나온다. 요청 건수를 너무 작게 잡으면(예: 100) 응답이 날짜 오름차순
    // 오래된 쪽부터 잘려서, "마지막 로우 = 최신값"이라는 가정이 깨지고 옛날 값을 최신값으로
    // 잘못 읽는 버그가 생긴다(실제로 로컬 curl 테스트에서 재현됨 — 100건 요청 시 최신값이
    // 2026-03-22자 값으로 잘못 나옴). 500이면 180일치가 통째로 들어와서 안전하다.
    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/500/${STAT_CODE}/D/${formatYmd(
      start
    )}/${formatYmd(end)}/${ITEM_CODE}`;

    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`ECOS HTTP ${res.status}`);

    const data = await res.json();
    const rows = data?.StatisticSearch?.row;
    if (!Array.isArray(rows) || rows.length === 0) throw new Error("ECOS 응답에 데이터 없음");

    // ECOS는 날짜 오름차순으로 내려주므로 마지막 항목이 최신값.
    const latest = rows[rows.length - 1];
    const ratePercent = Number(latest.DATA_VALUE);
    const rawDate: string = latest.TIME; // YYYYMMDD
    const effectiveDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;

    if (!Number.isFinite(ratePercent)) throw new Error("기준금리 값 파싱 실패");

    return NextResponse.json({
      ratePercent,
      effectiveDate,
      source: "ecos" as const,
      stale: false,
    });
  } catch {
    return NextResponse.json(fallback);
  }
}
