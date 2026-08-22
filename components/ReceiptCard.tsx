"use client";

import { forwardRef } from "react";
import { formatKRW } from "@/lib/calc";
import { BASE_PATH } from "@/lib/basePath";

export interface ReceiptLine {
  label: string;
  amount: number;
}

interface Props {
  title: string;
  subtitle?: string; // 상단 기준정보 태그. 예: "주택 매매 · 1억원 · 2026.08 기준"
  lines: ReceiptLine[];
  total: number;
  totalLabel?: string;
}

// 카카오톡 등으로 공유할 수 있는 "영수증 카드" 스타일 결과 카드.
// ShareReceiptButton과 짝을 이뤄, 이 카드를 그대로 이미지로 캡처해 다운로드/공유한다.
// forwardRef로 감싼 이유는 html2canvas가 캡처할 실제 DOM 노드가 필요하기 때문.
const ReceiptCard = forwardRef<HTMLDivElement, Props>(function ReceiptCard(
  { title, subtitle, lines, total, totalLabel = "합계" },
  ref
) {
  // 아직 금액을 입력하지 않은 상태(전부 0원)라면 숫자 0이 잔뜩 찍힌 영수증 대신
  // 안내 문구로 비워둔다 — 사용자가 값을 입력하면 자연스럽게 실시간 숫자로 채워짐.
  const isEmpty = total === 0 && lines.every((l) => l.amount === 0);

  return (
    <div ref={ref} className="rounded-xl border border-dashed border-[#C7D2DB] bg-white">
      <div className="p-4">
        <div className="text-center text-sm font-bold text-[#16232E]">{title}</div>
        {subtitle && (
          <div className="mt-1 text-center text-[11px] text-[#9AA5B1]">{subtitle}</div>
        )}
        {isEmpty ? (
          <div className="flex min-h-[120px] items-center justify-center border-t border-dashed border-[#C7D2DB] pt-3">
            <p className="text-center text-sm leading-relaxed text-[#9AA5B1]">
              금액을 입력하시면
              <br />
              실시간 영수증이 생성됩니다.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-3 space-y-1.5 border-t border-dashed border-[#C7D2DB] pt-3">
              {lines.map((l) => (
                <div key={l.label} className="flex justify-between text-sm text-[#4E5968]">
                  <span>{l.label}</span>
                  <span>{formatKRW(l.amount)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-dashed border-[#C7D2DB] pt-3 text-base font-bold text-[#16232E]">
              <span>{totalLabel}</span>
              <span className="text-cobalt">{formatKRW(total)}</span>
            </div>
          </>
        )}
      </div>
      {/* 하단 CTA: 텍스트를 동적으로 조립하면 카드 폭(특히 모바일)에 따라 flex-wrap이
          제각각 다른 지점에서 줄바꿈되어 정렬이 흐트러지는 문제가 있었다. 대신 Claude
          Design 목업(Receipt CTA.dc.html)에서 그대로 내보낸 이미지를 폭에 맞춰 스케일만
          하는 방식으로 바꿔, 카드 폭과 무관하게 항상 디자인과 동일하게 보이도록 했다. */}
      {/* v2: 2줄(가로로 넓은) 배너는 모바일 폭으로 축소되면 글자 높이가 너무 작아져
          뭉개져 보였다. 클로드 디자인에서 3줄 세로형으로 다시 뽑아 줄당 확보되는
          세로 픽셀을 늘려 같은 카드 폭에서도 훨씬 선명하게 보이도록 했다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}/images/receipt-cta-v2.png`}
        alt="리얼티북 | 공인중개사 1초 정산장부 (2인 평생 무료) — 네이버에서 '리얼티북'을 검색하세요"
        className="block aspect-[73/23] w-full rounded-b-[11px] object-cover"
      />
    </div>
  );
});

export default ReceiptCard;
