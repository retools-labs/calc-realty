"use client";

import { useMemo, useState } from "react";
import {
  calcBrokerageFee,
  formatKRW,
  type DealType,
  type PropertyType,
  type VatType,
} from "@/lib/calc";

function parseWon(raw: string): number {
  const n = Number(raw.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function WonInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#4E5968]">{label}</span>
      <div className="flex items-center rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 focus-within:border-toss-blue">
        <input
          inputMode="numeric"
          className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-[#B0B8C1]"
          placeholder={placeholder ?? "0"}
          value={value ? value.toLocaleString("ko-KR") : ""}
          onChange={(e) => onChange(parseWon(e.target.value))}
        />
        <span className="ml-2 shrink-0 text-[#8B95A1]">원</span>
      </div>
    </label>
  );
}

function SegButton<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
            value === opt.value
              ? "bg-toss-blue text-white"
              : "bg-white text-[#4E5968] border border-[#E5E8EB]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [propertyType, setPropertyType] = useState<PropertyType>("house");
  const [dealType, setDealType] = useState<DealType>("sale");
  const [isMonthly, setIsMonthly] = useState(false);
  const [price, setPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [vatType, setVatType] = useState<VatType>("general");
  const [negotiate, setNegotiate] = useState(false);
  const [negotiatedRate, setNegotiatedRate] = useState<number>(0);
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
    ].filter(Boolean);
    return lines.join("\n");
  }, [result, dealType, isMonthly, negotiate, savedByNegotiation]);

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
    <main className="mx-auto max-w-md px-4 pb-24 pt-8">
      <h1 className="text-2xl font-bold">복비 계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        법정 상한요율 기준으로 부동산 중개보수를 바로 계산해요.
      </p>

      <section className="mt-6 space-y-4 rounded-2xl bg-white p-4">
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
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4">
        <label className="flex items-center justify-between">
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
              <span className="font-semibold text-toss-blue">
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
              className="w-full"
            />
          </div>
        )}
      </section>

      <section className="mt-4 rounded-2xl bg-white p-5">
        <p className="text-sm text-[#8B95A1]">{result.bracketLabel} · 상한요율 {(result.capRate * 100).toFixed(2)}%</p>
        <p className="mt-1 text-3xl font-bold text-toss-blue">{formatKRW(result.appliedFee)}</p>
        <div className="mt-3 space-y-1 text-sm text-[#4E5968]">
          <div className="flex justify-between">
            <span>산정 거래금액</span>
            <span>{formatKRW(result.dealAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>상한요율 기준 보수</span>
            <span>{formatKRW(result.capFee)}</span>
          </div>
          {negotiate && (
            <div className="flex justify-between text-toss-blue">
              <span>네고로 절약된 금액</span>
              <span>−{formatKRW(savedByNegotiation)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>부가세 ({(result.vatRate * 100).toFixed(0)}%)</span>
            <span>{formatKRW(result.vat)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#E5E8EB] pt-2 text-base font-bold text-[#191F28]">
            <span>최종 지급액</span>
            <span>{formatKRW(result.totalWithVat)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 w-full rounded-xl bg-[#F2F4F6] py-3 text-sm font-semibold text-[#4E5968]"
        >
          {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
        </button>
      </section>

      <p className="mt-6 text-center text-xs leading-relaxed text-[#B0B8C1]">
        본 계산 결과는 법정 상한요율을 기준으로 한 참고용 안내이며, 실제 중개보수는 개업공인중개사와
        협의하여 결정됩니다. 일부 지자체는 조례가 다를 수 있어 정확한 금액은 관할 시·도 조례를
        확인하세요.
      </p>

      <PartnerBanner />
    </main>
  );
}

function RealtyBookLogo() {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 11.5 12 4l9 7.5"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 10v8.5A1.5 1.5 0 0 0 7 20h10a1.5 1.5 0 0 0 1.5-1.5V10"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.3 14.3 11 16l3.7-4"
          stroke="#4ADE80"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs font-bold tracking-tight text-white">리얼티북</span>
    </div>
  );
}

function PartnerBanner() {
  return (
    <a
      href="https://apple-realty.vercel.app/partner"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 block overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B6BFF] to-[#274DDB] p-5 text-white shadow-sm transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1 text-[10px] text-white/70">
            <span className="text-xl">📒</span>
            <span>기존 수기/엑셀 방식</span>
          </div>
          <span className="text-white/50">→</span>
          <div className="flex flex-col items-center gap-1 text-[10px] font-semibold text-white">
            <span className="text-xl">✅</span>
            <span>
              스마트 정산장부
              <br />
              &apos;리얼티북&apos;
            </span>
          </div>
        </div>
        <RealtyBookLogo />
      </div>

      <p className="mt-4 text-base font-bold leading-snug">
        소속중개사 수수료 정산,
        <br />
        아직도 엑셀로 하세요?
      </p>
      <p className="mt-1 text-xs text-white/80">
        스마트 정산장부 &apos;리얼티북&apos; 1개월 무료 체험하기
      </p>

      <span className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[#22C55E] px-4 py-2 text-sm font-bold text-white">
        🎁 1개월 무료 체험 신청
      </span>
    </a>
  );
}
