"use client";

import { useMemo, useState } from "react";
import { formatKRW } from "@/lib/calc";
import { calcCapRate, calcPremiumFee } from "@/lib/capRate";
import { WonInput } from "./ui";
import { ResultCard, ResultDivider, ResultHeadline, ResultRow } from "./ResultCard";

function formatPercent(v: number): string {
  return `${v.toFixed(2)}%`;
}

export default function CapRateCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanRatePercent, setLoanRatePercent] = useState(4.5);
  const [monthlyRent, setMonthlyRent] = useState(0);

  const [premiumAmount, setPremiumAmount] = useState(0);
  const [negotiatedRatePercent, setNegotiatedRatePercent] = useState(7);
  const [copied, setCopied] = useState(false);

  const capResult = useMemo(
    () => calcCapRate({ purchasePrice, deposit, loanAmount, loanRatePercent, monthlyRent }),
    [purchasePrice, deposit, loanAmount, loanRatePercent, monthlyRent]
  );

  const premiumResult = useMemo(
    () => calcPremiumFee(premiumAmount, negotiatedRatePercent),
    [premiumAmount, negotiatedRatePercent]
  );

  const shareText = useMemo(() => {
    const lines = [
      `[상가 임대수익률 계산]`,
      `실투자금(매매가-보증금-대출금): ${formatKRW(capResult.netInvestment)}`,
      `연간 임대수익: ${formatKRW(capResult.annualRentIncome)}`,
      `연간 대출이자: ${formatKRW(capResult.annualLoanInterest)}`,
      `연간 순수익: ${formatKRW(capResult.netAnnualIncome)}`,
      `임대수익률: ${capResult.capRatePercent !== null ? formatPercent(capResult.capRatePercent) : "계산불가(실투자금 0 이하)"}`,
      premiumAmount > 0 ? `` : null,
      premiumAmount > 0 ? `[권리금 수수료 예상액]` : null,
      premiumAmount > 0 ? `권리금: ${formatKRW(premiumAmount)}` : null,
      premiumAmount > 0
        ? `협의요율 ${negotiatedRatePercent}%: ${formatKRW(premiumResult.mid)} (통상 5~10% 구간: ${formatKRW(premiumResult.low)} ~ ${formatKRW(premiumResult.high)})`
        : null,
    ].filter((l) => l !== null);
    return lines.join("\n");
  }, [capResult, premiumAmount, negotiatedRatePercent, premiumResult]);

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
      <h1 className="text-2xl font-bold">상가 수익률·권리금 계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        상가 투자 임대수익률과, 협의 대상인 권리금 수수료 예상액을 계산해드립니다.
      </p>

      <div className="mt-5 space-y-4">
        <span className="block text-sm font-bold text-[#16232E]">임대수익률(Cap Rate)</span>
        <WonInput label="매매가" value={purchasePrice} onChange={setPurchasePrice} placeholder="예: 1,000,000,000" />
        <WonInput label="임차인 보증금" value={deposit} onChange={setDeposit} />
        <WonInput label="대출금" value={loanAmount} onChange={setLoanAmount} />

        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-[#4E5968]">
            <span>대출 연이자율</span>
            <span className="font-semibold text-cobalt">{loanRatePercent.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={0.1}
            value={loanRatePercent}
            onChange={(e) => setLoanRatePercent(Number(e.target.value))}
            className="w-full accent-cobalt"
          />
        </div>

        <WonInput label="월세" value={monthlyRent} onChange={setMonthlyRent} />
      </div>

      <div className="mt-5">
        <ResultCard>
          <ResultHeadline
            label="임대수익률(Cap Rate)"
            value={capResult.capRatePercent !== null ? formatPercent(capResult.capRatePercent) : "계산 불가"}
            subtitle="세전·감가상각 미반영 단순 참고 지표"
          />
          <ResultDivider />
          <ResultRow label="실투자금 (매매가−보증금−대출금)" value={formatKRW(capResult.netInvestment)} />
          <ResultRow label="연간 임대수익" value={formatKRW(capResult.annualRentIncome)} />
          <ResultRow label="연간 대출이자" value={`−${formatKRW(capResult.annualLoanInterest)}`} />
        </ResultCard>
        {capResult.capRatePercent === null && (
          <p className="mt-2 text-xs text-[#9AA5B1]">
            * 실투자금(매매가−보증금−대출금)이 0 이하라 수익률을 계산할 수 없어요. 값을 확인해주세요.
          </p>
        )}
      </div>

      <div className="mt-5 space-y-4 border-t border-[#E5E8EB] pt-4">
        <span className="block text-sm font-bold text-[#16232E]">권리금 수수료 예상액</span>
        <WonInput label="권리금" value={premiumAmount} onChange={setPremiumAmount} placeholder="예: 50,000,000" />

        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-[#4E5968]">
            <span>협의 수수료율</span>
            <span className="font-semibold text-cobalt">{negotiatedRatePercent}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={10}
            step={0.5}
            value={negotiatedRatePercent}
            onChange={(e) => setNegotiatedRatePercent(Number(e.target.value))}
            className="w-full accent-cobalt"
          />
          <p className="mt-1 text-xs text-[#8B95A1]">
            * 권리금 중개수수료는 법정 상한이 없는 협의 수수료로, 통상 5~10% 범위에서 결정됩니다.
          </p>
        </div>

        <ResultCard>
          <ResultHeadline
            label={`협의요율 ${negotiatedRatePercent}% 예상액`}
            value={formatKRW(premiumResult.mid).replace("원", "")}
            suffix="원"
            subtitle={`통상 5~10% 구간: ${formatKRW(premiumResult.low)} ~ ${formatKRW(premiumResult.high)}`}
          />
          <ResultDivider />
          <ResultRow label="5% 구간" value={formatKRW(premiumResult.low)} />
          <ResultRow label="10% 구간" value={formatKRW(premiumResult.high)} />
        </ResultCard>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 w-full rounded-xl bg-cobalt py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
      >
        {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        임대수익률은 세전·감가상각 미반영 단순 참고 지표이며, 권리금 수수료는 법정 상한이 없는
        협의 사항이라 실제 금액은 당사자 간 협의로 결정됩니다.
      </p>
    </div>
  );
}
