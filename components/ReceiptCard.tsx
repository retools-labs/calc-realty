"use client";

import { forwardRef } from "react";
import { formatKRW } from "@/lib/calc";

export interface ReceiptLine {
  label: string;
  amount: number;
}

interface Props {
  title: string;
  lines: ReceiptLine[];
  total: number;
  totalLabel?: string;
}

// 카카오톡 등으로 공유할 수 있는 "영수증 카드" 스타일 결과 카드.
// ShareReceiptButton과 짝을 이뤄, 이 카드를 그대로 이미지로 캡처해 다운로드/공유한다.
// forwardRef로 감싼 이유는 html2canvas가 캡처할 실제 DOM 노드가 필요하기 때문.
const ReceiptCard = forwardRef<HTMLDivElement, Props>(function ReceiptCard(
  { title, lines, total, totalLabel = "합계" },
  ref
) {
  return (
    <div ref={ref} className="rounded-xl border border-dashed border-[#C7D2DB] bg-white p-4">
      <div className="text-center text-sm font-bold text-[#16232E]">{title}</div>
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
      <div className="mt-4 border-t border-dashed border-[#C7D2DB] pt-2 text-center text-[10px] tracking-wide text-[#B0B8C1]">
        RealtyTools by Retools · Powered by RealtyBook
      </div>
    </div>
  );
});

export default ReceiptCard;
