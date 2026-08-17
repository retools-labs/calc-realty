"use client";

import { forwardRef } from "react";
import { formatKRW } from "@/lib/calc";

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
  return (
    <div ref={ref} className="rounded-xl border border-dashed border-[#C7D2DB] bg-white">
      <div className="p-4">
        <div className="text-center text-sm font-bold text-[#16232E]">{title}</div>
        {subtitle && (
          <div className="mt-1 text-center text-[11px] text-[#9AA5B1]">{subtitle}</div>
        )}
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
          <span className="text-[#14607F]">{formatKRW(total)}</span>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="flex items-start justify-between gap-3 rounded-b-[11px] bg-[#0A2540] px-4 pb-4 pt-3">
        <span className="flex min-w-0 items-start gap-1.5">
          <img src="/icons/rb-mark-white.png" alt="" className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="shrink-0 text-[11px] font-bold leading-normal text-white">리얼티북</span>
          <span className="shrink-0 text-[10px] leading-normal text-[#5b7185]">|</span>
          <span className="truncate text-[10.5px] leading-normal text-[#a9c2d6]">공인중개사 스마트 정산장부</span>
        </span>
        <span className="shrink-0 text-[10.5px] font-semibold leading-normal text-[#f5c433]">retools.kr</span>
      </div>
    </div>
  );
});

export default ReceiptCard;
