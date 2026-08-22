"use client";

import { useEffect, useMemo, useState } from "react";
import { formatKRW } from "@/lib/calc";
import {
  calcConversion,
  calcRenewalCap,
  getStatutoryConversionRatePercent,
  FALLBACK_BASE_RATE_PERCENT,
  FALLBACK_BASE_RATE_DATE,
  RENEWAL_INCREASE_CAP_PERCENT,
  type ConversionDirection,
} from "@/lib/jeonseConversion";
import { SegButton, WonInput, formatKoreanUnit } from "./ui";
import { ResultCard, ResultDivider, ResultHeadline, ResultRow } from "./ResultCard";
import { BASE_PATH } from "@/lib/basePath";

interface BaseRateInfo {
  ratePercent: number;
  effectiveDate: string;
  source: "ecos" | "fallback";
  stale: boolean;
}

const INITIAL_BASE_RATE: BaseRateInfo = {
  ratePercent: FALLBACK_BASE_RATE_PERCENT,
  effectiveDate: FALLBACK_BASE_RATE_DATE,
  source: "fallback",
  stale: true,
};

export default function JeonseConversionCalculator() {
  // 한국은행 기준금리 실시간 조회 — /api/base-rate가 ECOS Open API를 서버에서 대신 호출해준다.
  // 사용자는 아무것도 확인할 필요 없이, 화면을 열 때마다 자동으로 최신 법정 상한이 반영된다.
  const [baseRateInfo, setBaseRateInfo] = useState<BaseRateInfo>(INITIAL_BASE_RATE);
  const [baseRateLoading, setBaseRateLoading] = useState(true);
  const statutoryCap = useMemo(
    () => getStatutoryConversionRatePercent(baseRateInfo.ratePercent),
    [baseRateInfo.ratePercent]
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`${BASE_PATH}/api/base-rate`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (typeof data?.ratePercent === "number") {
          setBaseRateInfo(data);
        }
      })
      .catch(() => {
        /* 조용히 실패 — INITIAL_BASE_RATE(폴백)로 계속 동작 */
      })
      .finally(() => {
        if (!cancelled) setBaseRateLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 전월세 전환 계산기
  const [direction, setDirection] = useState<ConversionDirection>("depositToRent");
  const [baseDeposit, setBaseDeposit] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [rate, setRate] = useState(INITIAL_BASE_RATE.ratePercent + 2);
  const [rateTouched, setRateTouched] = useState(false);
  const [copied, setCopied] = useState(false);

  // 실시간 기준금리가 도착하면, 사용자가 슬라이더를 직접 만지지 않은 한 자동으로 최신 법정
  // 상한으로 맞춰준다(사용자가 이미 조정했다면 그 선택을 존중해 덮어쓰지 않는다).
  useEffect(() => {
    if (!rateTouched) setRate(statutoryCap);
  }, [statutoryCap, rateTouched]);

  const conversionResult = useMemo(
    () =>
      calcConversion({
        direction,
        baseDeposit,
        targetDepositOrRent: targetValue,
        conversionRatePercent: rate,
        currentBaseRatePercent: baseRateInfo.ratePercent,
      }),
    [direction, baseDeposit, targetValue, rate, baseRateInfo.ratePercent]
  );

  // 갱신청구권 5% 상한 계산기
  const [currentDeposit, setCurrentDeposit] = useState(0);
  const [currentMonthlyRent, setCurrentMonthlyRent] = useState(0);
  const renewalResult = useMemo(
    () => calcRenewalCap({ currentDeposit, currentMonthlyRent }),
    [currentDeposit, currentMonthlyRent]
  );

  const shareText = useMemo(() => {
    const lines = [
      `[전월세 전환율 계산 결과]`,
      `법정 전환율 상한: ${statutoryCap.toFixed(2)}% (기준금리 ${baseRateInfo.ratePercent}% + 2%p vs 연 10% 중 낮은 값, ${baseRateInfo.effectiveDate} 기준${baseRateInfo.stale ? ", 실시간 확인 실패로 마지막 확인값 사용" : ""})`,
      direction === "depositToRent"
        ? `보증금 ${formatKRW(baseDeposit)} → ${formatKRW(targetValue)}로 낮출 때, 적용 전환율 ${rate.toFixed(2)}% 기준 월세: ${formatKRW(conversionResult?.monthlyRent ?? 0)}`
        : `보증금 ${formatKRW(baseDeposit)} + 월세 ${formatKRW(targetValue)}를 전환율 ${rate.toFixed(2)}%로 환산한 보증금: ${formatKRW(conversionResult?.equivalentDeposit ?? 0)}`,
      conversionResult?.exceedsStatutoryCap ? `⚠ 적용 전환율이 법정 상한(${statutoryCap.toFixed(2)}%)을 초과합니다.` : null,
      ``,
      `[계약갱신청구권 5% 상한]`,
      `기존 보증금 ${formatKRW(currentDeposit)} / 월세 ${formatKRW(currentMonthlyRent)}`,
      `갱신 시 최대 보증금: ${formatKRW(renewalResult.maxDeposit)} (+${formatKRW(renewalResult.depositIncrease)})`,
      currentMonthlyRent > 0 ? `갱신 시 최대 월세: ${formatKRW(renewalResult.maxMonthlyRent)} (+${formatKRW(renewalResult.monthlyRentIncrease)})` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [direction, baseDeposit, targetValue, rate, conversionResult, currentDeposit, currentMonthlyRent, renewalResult, statutoryCap, baseRateInfo]);

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
      <h1 className="text-2xl font-bold">전월세 전환율·5% 상한 계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        주택임대차보호법상 법정 전환율 상한과, 계약갱신청구권 행사 시 5% 증액 상한을 계산해드립니다.
      </p>
      <p className="mt-2 rounded-lg bg-[#F2F6FA] px-3 py-2 text-xs leading-relaxed text-[#4E5968]">
        현재 법정 전환율 상한 <span className="font-bold text-cobalt">{statutoryCap.toFixed(2)}%</span> ·
        한국은행 기준금리 {baseRateInfo.ratePercent}% + 2%p와 연 10% 중 낮은 값
        {baseRateLoading ? (
          <span className="text-[#8B95A1]"> (기준금리 확인 중…)</span>
        ) : baseRateInfo.stale ? (
          <span className="text-[#E0453C]"> (실시간 확인 실패 — {baseRateInfo.effectiveDate} 기준 마지막 확인값 사용 중)</span>
        ) : (
          <span className="text-cobalt"> (한국은행 실시간 확인, {baseRateInfo.effectiveDate} 기준)</span>
        )}
      </p>

      {/* 전월세 전환 계산기 */}
      <div className="mt-5 space-y-4">
        <span className="block text-sm font-bold text-[#16232E]">전월세 전환 계산기</span>

        <div>
          <span className="mb-2 block text-sm font-medium text-[#4E5968]">계산 방향</span>
          <SegButton
            value={direction}
            onChange={(v) => {
              setDirection(v);
              setTargetValue(0);
            }}
            options={[
              { value: "depositToRent", label: "보증금 → 월세 전환" },
              { value: "rentToDeposit", label: "월세 → 보증금 환산" },
            ]}
          />
        </div>

        <WonInput
          label={direction === "depositToRent" ? "현재 전세보증금" : "현재 보증금"}
          value={baseDeposit}
          onChange={setBaseDeposit}
          placeholder="예: 300,000,000"
        />

        {direction === "depositToRent" ? (
          <WonInput label="전환 후 낮출 보증금" value={targetValue} onChange={setTargetValue} />
        ) : (
          <WonInput label="현재 월세" value={targetValue} onChange={setTargetValue} placeholder="예: 700,000" />
        )}

        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-[#4E5968]">
            <span>적용 전환율</span>
            <span className="font-semibold text-cobalt">{rate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.05}
            value={rate}
            onChange={(e) => {
              setRateTouched(true);
              setRate(Number(e.target.value));
            }}
            className="w-full accent-cobalt"
          />
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-[#8B95A1]">
              * 기본값은 법정 상한({statutoryCap.toFixed(2)}%)이며, 협의된 다른 전환율로 비교해볼 수 있어요.
            </p>
            {rateTouched && (
              <button
                type="button"
                onClick={() => {
                  setRateTouched(false);
                  setRate(statutoryCap);
                }}
                className="shrink-0 pl-2 text-xs font-semibold text-cobalt underline"
              >
                법정 상한으로
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        {conversionResult ? (
          <ResultCard>
            {direction === "depositToRent" ? (
              <>
                <ResultHeadline
                  label={`전환율 ${rate.toFixed(2)}% 적용`}
                  value={formatKRW(conversionResult.monthlyRent).replace("원", "")}
                  suffix="원"
                  subtitle="예상 월세"
                />
                <ResultDivider />
                <ResultRow
                  label="낮추는 보증금"
                  value={`${formatKRW(conversionResult.convertedAmount)} (${formatKoreanUnit(conversionResult.convertedAmount) || "0원"})`}
                />
                <ResultRow label="전환 후 보증금" value={formatKRW(conversionResult.equivalentDeposit)} />
              </>
            ) : (
              <>
                <ResultHeadline
                  label={`전환율 ${rate.toFixed(2)}% 기준`}
                  value={formatKRW(conversionResult.equivalentDeposit).replace("원", "")}
                  suffix="원"
                  subtitle="환산 보증금(현재 보증금 + 월세 환산분)"
                />
                <ResultDivider />
                <ResultRow label="입력한 월세" value={formatKRW(conversionResult.monthlyRent)} />
                <ResultRow label="현재 보증금" value={formatKRW(baseDeposit)} />
              </>
            )}
          </ResultCard>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E5E8EB] px-4 py-6 text-center text-sm text-[#8B95A1]">
            금액을 입력하면 전환 결과를 계산해드려요.
          </div>
        )}
        {conversionResult?.exceedsStatutoryCap && (
          <p className="mt-2 text-xs font-semibold text-[#E0453C]">
            ⚠ 적용 전환율이 법정 상한 {statutoryCap.toFixed(2)}%를 초과했어요. 실제 계약에서는 상한을
            넘는 전환율을 요구할 수 없어요.
          </p>
        )}
      </div>

      {/* 갱신청구권 5% 상한 계산기 */}
      <div className="mt-5 space-y-4 border-t border-[#E5E8EB] pt-4">
        <span className="block text-sm font-bold text-[#16232E]">계약갱신청구권 {RENEWAL_INCREASE_CAP_PERCENT}% 상한 계산기</span>
        <WonInput label="기존 보증금" value={currentDeposit} onChange={setCurrentDeposit} placeholder="예: 300,000,000" />
        <WonInput label="기존 월세 (전세면 0)" value={currentMonthlyRent} onChange={setCurrentMonthlyRent} />

        <ResultCard>
          <ResultHeadline
            label={`증액 상한 ${RENEWAL_INCREASE_CAP_PERCENT}%`}
            value={formatKRW(renewalResult.maxDeposit).replace("원", "")}
            suffix="원"
            subtitle="갱신 시 최대 보증금"
          />
          <ResultDivider />
          <ResultRow label="보증금 증가분" value={`+${formatKRW(renewalResult.depositIncrease)}`} />
          {currentMonthlyRent > 0 && (
            <>
              <ResultRow label="갱신 시 최대 월세" value={formatKRW(renewalResult.maxMonthlyRent)} />
              <ResultRow label="월세 증가분" value={`+${formatKRW(renewalResult.monthlyRentIncrease)}`} />
            </>
          )}
        </ResultCard>
        <p className="text-xs text-[#8B95A1]">
          * 계약갱신요구권 행사로 갱신되는 계약에 한해 적용되는 상한이며, 신규 계약이나 임차인의 동의로
          갱신되는 합의갱신에는 이 상한이 적용되지 않을 수 있어요.
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 w-full rounded-xl bg-cobalt py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
      >
        {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        본 계산 결과는 주택임대차보호법 및 같은 법 시행령 기준 참고용 안내이며, 법정 전환율 상한은
        한국은행 기준금리 변동에 따라 수시로 바뀝니다(이 화면은 한국은행 공시 기준금리를 실시간으로
        반영합니다). 실제 계약 전 관할 법령을 꼭 다시 확인하세요.
      </p>
    </div>
  );
}
