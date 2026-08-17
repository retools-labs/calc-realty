"use client";

import { useMemo, useState } from "react";
import { calcProrate } from "@/lib/prorate";
import { formatKRW } from "@/lib/calc";
import { WonInput } from "./ui";
import { ResultCard, ResultDivider, ResultHeadline, ResultRow } from "./ResultCard";

function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// design-preview: 이 탭은 app/page.tsx에서 공인중개사 실무용 모드일 때만 노출된다(잠금 게이트).
// mode prop은 상위 페이지와의 인터페이스를 맞추기 위해 받되, 계산 로직 자체는 매도/매수인 분리 없이
// 기존 단일 합계 방식을 그대로 유지한다 — 목업의 분리 계산은 별도 기능 확장으로 남겨둠.
export default function ProrateCalculator({ mode }: { mode?: "customer" | "agent" } = {}) {
  void mode;
  const [moveInDate, setMoveInDate] = useState(todayISO());
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [monthlyMaintenanceFee, setMonthlyMaintenanceFee] = useState(0);
  const [longTermRepairFund, setLongTermRepairFund] = useState(0);
  const [includeRepairFund, setIncludeRepairFund] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () =>
      calcProrate({
        moveInDate,
        monthlyRent,
        monthlyMaintenanceFee,
        longTermRepairFund,
        includeRepairFund,
      }),
    [moveInDate, monthlyRent, monthlyMaintenanceFee, longTermRepairFund, includeRepairFund]
  );

  const shareText = useMemo(() => {
    if (!result) return "";
    const lines = [
      `[잔금일 월세·관리비 일할계산 결과]`,
      `입주일: ${result.year}년 ${result.month}월 ${result.moveInDay}일`,
      `해당월 총일수: ${result.daysInMonth}일 / 거주일수: ${result.occupiedDays}일`,
      `일할 월세: ${formatKRW(result.proratedRent)}`,
      `일할 관리비: ${formatKRW(result.proratedMaintenanceFee)}`,
      includeRepairFund ? `일할 장기수선충당금: ${formatKRW(result.proratedRepairFund)}` : null,
      `합계: ${formatKRW(result.totalProrated)}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [result, includeRepairFund]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold">잔금일 일할계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        잔금(입주)일이 월 중간이면, 그 달 월세·관리비를 며칠치만 내면 되는지 계산해드립니다.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#4E5968]">잔금(입주)일</span>
          <input
            type="date"
            className="w-full rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 text-lg font-semibold outline-none focus:border-cobalt"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
          />
        </label>

        <WonInput label="월세" value={monthlyRent} onChange={setMonthlyRent} />
        <WonInput label="관리비" value={monthlyMaintenanceFee} onChange={setMonthlyMaintenanceFee} />

        <div className="rounded-xl border border-[#E5E8EB] p-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-semibold">장기수선충당금도 포함해서 계산</span>
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={includeRepairFund}
              onChange={(e) => setIncludeRepairFund(e.target.checked)}
            />
          </label>
          <p className="mt-1 text-xs text-[#8B95A1]">
            * 장기수선충당금은 원칙적으로 임대인(소유자) 부담이라 임차인에게 청구하지 않는 게
            일반적이지만, 관리비에 합산 청구하는 경우를 대비해 옵션으로 뒀어요.
          </p>
          {includeRepairFund && (
            <div className="mt-3">
              <WonInput label="장기수선충당금 (월)" value={longTermRepairFund} onChange={setLongTermRepairFund} />
            </div>
          )}
        </div>
      </div>

      {result ? (
        <>
          <div className="mt-4">
            <ResultCard>
              <ResultHeadline
                label={`${result.year}년 ${result.month}월 · 입주일 ${result.moveInDay}일부터 ${result.occupiedDays}일 거주 (총 ${result.daysInMonth}일)`}
                value={formatKRW(result.totalProrated).replace("원", "")}
                suffix="원"
                subtitle="일할 정산 합계"
              />
              <ResultDivider />
              <ResultRow label="일할 월세" value={formatKRW(result.proratedRent)} />
              <ResultRow label="일할 관리비" value={formatKRW(result.proratedMaintenanceFee)} />
              {includeRepairFund && (
                <ResultRow label="일할 장기수선충당금" value={formatKRW(result.proratedRepairFund)} />
              )}
            </ResultCard>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 w-full rounded-xl bg-cobalt py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
          >
            {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
          </button>
        </>
      ) : (
        <p className="mt-4 text-sm text-[#8B95A1]">날짜를 입력해주세요.</p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        일할계산은 실무 관행(금액 ÷ 해당월 총일수 × 거주일수)을 기준으로 한 참고용 계산이며,
        실제 정산 방식은 임대차계약서 특약사항이 우선합니다.
      </p>
    </div>
  );
}
