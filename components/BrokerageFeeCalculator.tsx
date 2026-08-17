"use client";

import { useMemo, useState } from "react";
import {
  calcBrokerageFee,
  formatKRW,
  type DealType,
  type PropertyType,
  type VatType,
} from "@/lib/calc";
import { SegButton, WonInput } from "./ui";

type UserMode = "customer" | "agent";
type CoBrokerage = "single" | "double"; // 단타(공동중개, 50%) / 양타(단독 또는 양쪽 대리, 100%)

export default function BrokerageFeeCalculator() {
  const [userMode, setUserMode] = useState<UserMode>("customer");
  const [propertyType, setPropertyType] = useState<PropertyType>("house");
  const [dealType, setDealType] = useState<DealType>("sale");
  const [isMonthly, setIsMonthly] = useState(false);
  const [price, setPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [vatType, setVatType] = useState<VatType>("general");
  const [negotiate, setNegotiate] = useState(false);
  const [negotiatedRate, setNegotiatedRate] = useState<number>(0);
  const [coBrokerage, setCoBrokerage] = useState<CoBrokerage>("double");
  const [rsRate, setRsRate] = useState<number>(70);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return calcBrokerageFee({
      propertyType,
      dealType,
      price: dealType === "sale" ? price : deposit,
      deposit: dealType === "lease" ? deposit : undefined,
      monthlyRent: dealType === "lease" && isMonthly ? monthlyRent : undefined,
      vatType,
      negotiatedRate: negotiate ? negotiatedRate : undefined,
    });
  }, [propertyType, dealType, price, deposit, monthlyRent, isMonthly, vatType, negotiate, negotiatedRate]);

  const savedByNegotiation = Math.max(0, result.capFee - result.appliedFee);

  // 공동중개(단타/양타) + RS 분배율 — 세전 중개보수(appliedFee) 기준으로 계산.
  // 부가세는 사무소가 신고·납부하는 몫이라 개인 분배 대상에서 제외한다.
  const officeFee = Math.round(result.appliedFee * (coBrokerage === "single" ? 0.5 : 1));
  const personalFee = Math.round(officeFee * (rsRate / 100));

  const shareText = useMemo(() => {
    const dealLabel =
      dealType === "sale" ? "매매/교환" : isMonthly ? "월세" : "전세(임대차)";
    const lines = [
      `[부동산 중개보수 계산 결과]`,
      `매물유형: ${result.bracketLabel}`,
      `거래유형: ${dealLabel}`,
      `산정 거래금액: ${formatKRW(result.dealAmount)}`,
      `상한요율: ${(result.capRate * 100).toFixed(2)}% (상한 보수 ${formatKRW(result.capFee)})`,
      negotiate
        ? `협의요율: ${(result.appliedRate * 100).toFixed(2)}% → 절약액 ${formatKRW(savedByNegotiation)}`
        : null,
      `중개보수: ${formatKRW(result.appliedFee)}`,
      `부가세(${(result.vatRate * 100).toFixed(0)}%): ${formatKRW(result.vat)}`,
      `최종 지급액: ${formatKRW(result.totalWithVat)}`,
      userMode === "agent"
        ? `공동중개: ${coBrokerage === "single" ? "단타 50%" : "양타 100%"} → 사무소 수령액 ${formatKRW(officeFee)}`
        : null,
      userMode === "agent" ? `RS 분배율 ${rsRate}% → 개인 수령액 ${formatKRW(personalFee)}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [result, dealType, isMonthly, negotiate, savedByNegotiation, userMode, coBrokerage, rsRate, officeFee, personalFee]);

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
      <h1 className="text-2xl font-bold">복비 계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        법정 상한요율 기준 부동산 중개보수를 계산해드립니다.
      </p>

      <div className="mt-4">
        <SegButton
          value={userMode}
          onChange={setUserMode}
          options={[
            { value: "customer", label: "일반고객용" },
            { value: "agent", label: "공인중개사 실무용" },
          ]}
        />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <span className="mb-2 block text-sm font-medium text-[#4E5968]">매물 유형</span>
          <SegButton
            value={propertyType}
            onChange={setPropertyType}
            options={[
              { value: "house", label: "주택" },
              { value: "officetelSmall", label: "오피스텔(85㎡↓)" },
              { value: "officetelOther", label: "오피스텔(그외)" },
              { value: "other", label: "토지·상가" },
            ]}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-[#4E5968]">거래 유형</span>
          <SegButton
            value={dealType}
            onChange={(v) => {
              setDealType(v);
              if (v === "sale") setIsMonthly(false);
            }}
            options={[
              { value: "sale", label: "매매·교환" },
              { value: "lease", label: "임대차(전세/월세)" },
            ]}
          />
        </div>

        {dealType === "lease" && (
          <div>
            <span className="mb-2 block text-sm font-medium text-[#4E5968]">임대차 세부유형</span>
            <SegButton
              value={isMonthly ? "monthly" : "jeonse"}
              onChange={(v) => setIsMonthly(v === "monthly")}
              options={[
                { value: "jeonse", label: "전세(보증금만)" },
                { value: "monthly", label: "월세(보증금+월세)" },
              ]}
            />
          </div>
        )}

        {dealType === "sale" && (
          <WonInput label="매매가" value={price} onChange={setPrice} placeholder="예: 500,000,000" />
        )}
        {dealType === "lease" && (
          <WonInput
            label={isMonthly ? "보증금" : "전세 보증금"}
            value={deposit}
            onChange={setDeposit}
          />
        )}
        {dealType === "lease" && isMonthly && (
          <WonInput label="월세" value={monthlyRent} onChange={setMonthlyRent} />
        )}

        <div>
          <span className="mb-2 block text-sm font-medium text-[#4E5968]">부가세 구분</span>
          <SegButton
            value={vatType}
            onChange={setVatType}
            options={[
              { value: "general", label: "일반과세 10%" },
              { value: "simplified", label: "간이과세 4%" },
              { value: "exempt", label: "면세/생략" },
            ]}
          />
          {vatType === "simplified" && (
            <p className="mt-1 text-xs text-[#8B95A1]">
              * 간이과세자 실효세율은 업종별 부가가치율에 따라 달라질 수 있어 참고용 근사치예요.
            </p>
          )}
        </div>
      </div>

      {userMode === "agent" && (
        <div className="mt-5 space-y-4 border-t border-[#E5E8EB] pt-4">
          <div>
            <span className="mb-2 block text-sm font-medium text-[#4E5968]">공동중개</span>
            <SegButton
              value={coBrokerage}
              onChange={setCoBrokerage}
              options={[
                { value: "single", label: "단타 50%" },
                { value: "double", label: "양타 100%" },
              ]}
            />
            <p className="mt-1 text-xs text-[#8B95A1]">
              * 단타 = 다른 사무소와 공동중개(내 사무소는 중개보수의 절반만 수령) / 양타 = 단독중개
              또는 양쪽 모두 대리(중개보수 전액 수령)
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm text-[#4E5968]">
              <span>RS 분배율(사무소 → 담당 중개사)</span>
              <span className="font-semibold text-[#14607F]">{rsRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={rsRate}
              onChange={(e) => setRsRate(Number(e.target.value))}
              className="w-full accent-[#14607F]"
            />
          </div>
        </div>
      )}

      <label className="mt-5 flex items-center justify-between border-t border-[#E5E8EB] pt-4">
        <span className="text-sm font-semibold">협의(네고) 요율로 계산하기</span>
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={negotiate}
          onChange={(e) => setNegotiate(e.target.checked)}
        />
      </label>
      {negotiate && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-sm text-[#4E5968]">
            <span>협의요율</span>
            <span className="font-semibold text-[#14607F]">
              {negotiatedRate.toFixed(2)}% (상한 {(result.capRate * 100).toFixed(2)}%)
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={result.capRate * 100}
            step={0.01}
            value={Math.min(negotiatedRate, result.capRate * 100)}
            onChange={(e) => setNegotiatedRate(Number(e.target.value))}
            className="w-full accent-[#14607F]"
          />
        </div>
      )}

      <div className="mt-4 rounded-xl bg-[#EAF2F7] px-4 py-3 text-sm font-medium text-[#14607F]">
        {result.bracketLabel} · 상한요율 {(result.capRate * 100).toFixed(2)}%
      </div>

      <div className="mt-4 space-y-1 border-t border-[#E5E8EB] pt-4 text-sm text-[#4E5968]">
        <div className="flex justify-between">
          <span>산정 거래금액</span>
          <span>{formatKRW(result.dealAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>상한요율 기준 보수</span>
          <span>{formatKRW(result.capFee)}</span>
        </div>
        {negotiate && (
          <div className="flex justify-between text-[#14607F]">
            <span>네고로 절약된 금액</span>
            <span>−{formatKRW(savedByNegotiation)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>부가세 ({(result.vatRate * 100).toFixed(0)}%)</span>
          <span>{formatKRW(result.vat)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-[#E5E8EB] pt-2 text-base font-bold text-[#16232E]">
          <span>최종 지급액</span>
          <span className="text-[#14607F]">{formatKRW(result.totalWithVat)}</span>
        </div>
      </div>

      {userMode === "agent" && (
        <div className="mt-4 space-y-1 border-t border-[#E5E8EB] pt-4 text-sm text-[#4E5968]">
          <div className="flex justify-between">
            <span>사무소 수령액 ({coBrokerage === "single" ? "단타 50%" : "양타 100%"})</span>
            <span>{formatKRW(officeFee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#E5E8EB] pt-2 text-base font-bold text-[#16232E]">
            <span>담당 중개사 개인 수령액 (RS {rsRate}%)</span>
            <span className="text-[#14607F]">{formatKRW(personalFee)}</span>
          </div>
          <p className="pt-1 text-xs text-[#9AA5B1]">
            * 세전(부가세 제외) 중개보수 기준 분배액이며, 실제 정산은 사무소 내부 규정에 따라 달라질
            수 있습니다.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 w-full rounded-xl bg-[#14607F] py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
      >
        {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        본 계산 결과는 법정 상한요율을 기준으로 한 참고용 안내이며, 실제 중개보수는 개업공인중개사와
        협의하여 결정됩니다. 일부 지자체는 조례가 다를 수 있어 정확한 금액은 관할 시·도 조례를
        확인하세요.
      </p>
    </div>
  );
}
