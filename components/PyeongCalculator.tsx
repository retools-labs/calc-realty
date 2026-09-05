"use client";

import { useMemo, useState } from "react";
import { formatKRW } from "@/lib/calc";
import { calcPyeong, type AreaUnit } from "@/lib/pyeong";
import { SegButton, WonInput, formatKoreanUnit } from "./ui";
import { ResultCard, ResultDivider, ResultHeadline, ResultRow } from "./ResultCard";

export default function PyeongCalculator() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("pyeong");
  const [areaRaw, setAreaRaw] = useState("");
  const [copied, setCopied] = useState(false);

  const areaValue = Number(areaRaw.replace(/[^0-9.]/g, "")) || 0;

  const result = useMemo(
    () => calcPyeong({ totalAmount, areaValue, areaUnit }),
    [totalAmount, areaValue, areaUnit]
  );

  const shareText = useMemo(() => {
    if (!result) return "";
    return [
      `[평수·평단가 계산 결과]`,
      `총 금액: ${formatKRW(totalAmount)}`,
      `면적: ${result.pyeong.toFixed(2)}평 (${result.sqm.toFixed(2)}㎡)`,
      `평당가: ${formatKRW(result.pricePerPyeong)}`,
      `㎡당가: ${formatKRW(result.pricePerSqm)}`,
    ].join("\n");
  }, [result, totalAmount]);

  async function handleCopy() {
    if (!shareText) return;
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
      <h1 className="text-2xl font-bold">평수·평단가 계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        평↔㎡ 환산과 평당가·㎡당가를 바로 계산해드립니다.
      </p>

      <div className="mt-5 space-y-4">
        <WonInput label="총 금액" value={totalAmount} onChange={setTotalAmount} placeholder="예: 500,000,000" />

        <div>
          <span className="mb-2 block text-sm font-medium text-[#4E5968]">면적 입력 단위</span>
          <SegButton
            value={areaUnit}
            onChange={setAreaUnit}
            options={[
              { value: "pyeong", label: "평" },
              { value: "sqm", label: "㎡(제곱미터)" },
            ]}
          />
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#4E5968]">
            면적 ({areaUnit === "pyeong" ? "평" : "㎡"})
          </span>
          <div className="flex items-center rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 focus-within:border-cobalt">
            <input
              inputMode="decimal"
              className="w-full bg-transparent text-xl font-bold text-navy outline-none placeholder:text-base placeholder:font-normal placeholder:text-[#B0B8C1]"
              placeholder={areaUnit === "pyeong" ? "예: 25.7" : "예: 84.97"}
              value={areaRaw}
              onChange={(e) => setAreaRaw(e.target.value)}
            />
            <span className="ml-2 shrink-0 text-[#8B95A1]">{areaUnit === "pyeong" ? "평" : "㎡"}</span>
          </div>
          {result && (
            <span className="mt-1 block pl-1 text-xs font-semibold text-cobalt">
              {areaUnit === "pyeong"
                ? `≒ ${result.sqm.toFixed(2)}㎡`
                : `≒ ${result.pyeong.toFixed(2)}평`}
            </span>
          )}
        </label>
      </div>

      <div className="mt-5">
        {result ? (
          <ResultCard>
            <ResultHeadline
              label="평당가"
              value={formatKRW(result.pricePerPyeong).replace("원", "")}
              suffix="원"
              subtitle={`${result.pyeong.toFixed(2)}평 · ${result.sqm.toFixed(2)}㎡ 기준`}
            />
            <ResultDivider />
            <ResultRow label="총 금액" value={`${formatKRW(totalAmount)} (${formatKoreanUnit(totalAmount) || "0원"})`} />
            <ResultRow label="㎡당가" value={formatKRW(result.pricePerSqm)} />
            <ResultRow label="평 ↔ ㎡ 환산" value={`1평 = 3.3058㎡`} />
          </ResultCard>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E5E8EB] px-4 py-6 text-center text-sm text-[#8B95A1]">
            면적을 입력하면 평당가·㎡당가를 계산해드려요.
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!result}
        className="mt-4 w-full rounded-xl bg-cobalt py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-40"
      >
        {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        1평 = 400/121㎡(≒3.3058㎡) 기준 단순 환산이며, 등기·건축물대장상 면적과는 소수점 처리 방식에
        따라 미세한 차이가 있을 수 있습니다.
      </p>
    </div>
  );
}
