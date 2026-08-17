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
      {/* 하단 CTA: Claude Design 목업(Receipt CTA.dc.html)의 "2줄 계층 분리형" 스펙을 그대로 이식.
          1줄 = 브랜드+혜택(정보 전달), 2줄 = 단 하나의 명확한 검색 행동(CTA)으로 역할을 분리한다. */}
      <div
        className="flex flex-col items-center gap-3 overflow-hidden rounded-b-[11px] px-[22px] py-[17px]"
        style={{ background: "linear-gradient(120deg, #08203a 0%, #0d3b57 55%, #15719b 100%)" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/rb-mark-white.png" alt="" className="h-[23px] w-auto shrink-0" />
          <span className="whitespace-nowrap text-base font-extrabold tracking-[-0.2px] text-white">리얼티북</span>
          <span className="h-[15px] w-px shrink-0 bg-white/[0.28]" />
          <span className="whitespace-nowrap text-[15px] font-bold tracking-[-0.2px] text-[#C8E9F2]">
            공인중개사 1초 정산장부
          </span>
          <span className="whitespace-nowrap text-sm font-extrabold tracking-[-0.2px] text-[#F5C433]">
            (2인 평생 무료)
          </span>
        </div>
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#F5C433] px-5 py-[11px] text-[14.5px] font-extrabold leading-none tracking-[-0.2px] text-[#0A2540] shadow-[0_5px_14px_rgba(8,32,68,0.32)]">
          🔍 네이버에서 &apos;리얼티북&apos;을 검색하세요
        </span>
      </div>
    </div>
  );
});

export default ReceiptCard;
