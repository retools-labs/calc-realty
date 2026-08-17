"use client";

import { useMemo, useRef, useState } from "react";
import {
  calcBrokerageFee,
  formatKRW,
  type DealType,
  type PropertyType,
  type VatType,
} from "@/lib/calc";
import { SegButton, WonInput } from "./ui";
import ReceiptCard from "./ReceiptCard";
import ShareReceiptButton from "./ShareReceiptButton";

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
  const [vatType, setVatType] = useState<VatType>("exempt");
  const [coBrokerage, setCoBrokerage] = useState<CoBrokerage>("double");
  const [rsRate, setRsRate] = useState<number>(70);
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => {
    return calcBrokerageFee({
      propertyType,
      dealType,
      price: dealType === "sale" ? price : deposit,
      deposit: dealType === "lease" ? deposit : undefined,
      monthlyRent: dealType === "lease" && isMonthly ? monthlyRent : undefined,
      vatType,
    });
  }, [propertyType, dealType, price, deposit, monthlyRent, isMonthly, vatType]);

  // 공동중개(단타/양타) + RS 분배율 — 세전 중개보수(appliedFee) 기준으로 계산.
  // 부가세는 사무소가 신고·납부하는 몫이라 개인 분배 대상에서 제외한다.
  const officeFee = Math.round(result.appliedFee * (coBrokerage === "single" ? 0.5 : 1));
  const personalFee = Math.round(officeFee * (rsRate / 100));

  const propertyLabel =
    propertyType === "house"
      ? "주택"
      : propertyType === "officetelSmall"
        ? "오피스텔(85㎡↓)"
        : propertyType === "officetelOther"
          ? "오피스텔"
          : "토지·상가";
  const dealLabel = dealType === "sale" ? "매매/교환" : isMonthly ? "월세" : "전세(임대차)";
  const receiptSubtitle = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
    return `${propertyLabel} ${dealLabel} · ${formatKRW(result.dealAmount)} · ${ym} 기준`;
  }, [propertyLabel, dealLabel, result.dealAmount]);

  const shareText = useMemo(() => {
    const lines = [
      `[부동산 중개보수 계산 결과]`,
      `매물유형: ${result.bracketLabel}`,
      `거래유형: ${dealLabel}`,
      `산정 거래금액: ${formatKRW(result.dealAmount)}`,
      `상한요율: ${(result.capRate * 100).toFixed(2)}% (상한 보수 ${formatKRW(result.capFee)})`,
      `중개보수: ${formatKRW(result.appliedFee)}`,
      `부가세(${(result.vatRate * 100).toFixed(0)}%): ${formatKRW(result.vat)}`,
      `최종 지급액: ${formatKRW(result.totalWithVat)}`,
      userMode === "agent"
        ? `공동중개: ${coBrokerage === "single" ? "단타 50%" : "양타 100%"} → 사무소 수령액 ${formatKRW(officeFee)}`
        : null,
      userMode === "agent" ? `RS 분배율 ${rsRate}% → 개인 수령액 ${formatKRW(personalFee)}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [result, dealType, isMonthly, userMode, coBrokerage, rsRate, officeFee, personalFee]);

  const receiptLines = useMemo(() => {
    const base = [
      { label: "산정 거래금액", amount: result.dealAmount },
      { label: "상한요율 기준 보수", amount: result.capFee },
      { label: `부가세 (${(result.vatRate * 100).toFixed(0)}%)`, amount: result.vat },
    ];
    if (userMode === "agent") {
      base.push(
        { label: `사무소 수령액 (${coBrokerage === "single" ? "단타 50%" : "양타 100%"})`, amount: officeFee },
        { label: `개인 수령액 (RS ${rsRate}%)`, amount: personalFee }
      );
    }
    return base;
  }, [result, userMode, coBrokerage, rsRate, officeFee, personalFee]);

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

      <div className="mt-5 rounded-xl bg-[#EAF2F7] px-4 py-3 text-sm font-medium text-[#14607F]">
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

      <div className="mt-4">
        <ReceiptCard
          ref={receiptRef}
          title="부동산 중개보수 계산 결과"
          subtitle={receiptSubtitle}
          lines={receiptLines}
          total={result.totalWithVat}
          totalLabel="최종 지급액"
        />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 w-full rounded-xl bg-[#14607F] py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
      >
        {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
      </button>

      <ShareReceiptButton targetRef={receiptRef} fileName="리얼티북_복비계산_영수증.png" />

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        본 계산 결과는 법정 상한요율을 기준으로 한 참고용 안내이며, 실제 중개보수는 개업공인중개사와
        협의하여 결정됩니다. 일부 지자체는 조례가 다를 수 있어 정확한 금액은 관할 시·도 조례를
        확인하세요.
      </p>
    </div>
  );
}
