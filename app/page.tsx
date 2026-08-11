"use client";

import { useMemo, useState } from "react";
import {
  calcBrokerageFee,
  formatKRW,
  type DealType,
  type PropertyType,
  type VatType,
} from "@/lib/calc";

const PARTNER_URL = "https://apple-realty.vercel.app/partner";

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
      <div className="flex items-center rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 focus-within:border-[#14607F]">
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
              ? "bg-[#14607F] text-white"
              : "bg-white text-[#4E5968] border border-[#E5E8EB]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */

const BANNER_FEATURES = [
  {
    label: "중개물건 관리",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8.5a1.5 1.5 0 0 1 1.5-1.5H10l1.8 2H19.5A1.5 1.5 0 0 1 21 10.5v7A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      </svg>
    ),
  },
  {
    label: "수수료 계산",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
        <path d="M8 7.5h8" />
        <path d="M8 12h1.5M11.25 12h1.5M14.5 12H16M8 15.5h1.5M11.25 15.5h1.5M14.5 15.5H16" />
      </svg>
    ),
  },
  {
    label: "월별 정산",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5.5" width="18" height="15" rx="2" />
        <path d="M3 10h18M8 3.5v3M16 3.5v3" />
      </svg>
    ),
  },
];

function PartnerBanner() {
  return (
    <div className="mx-auto max-w-md px-4">
      <a
        href={PARTNER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d3b52] to-[#1c7fa0] p-5 shadow-sm transition active:scale-[0.99]"
      >
        {/* 배경 워터마크 RB 로고 (연하게) */}
        <img
          src="/icons/icon-192.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rounded-2xl opacity-10"
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="h-px w-4 bg-[#f5c344]" />
              <span className="text-[11px] font-bold tracking-wider text-[#f5c344]">REALTYBOOK</span>
            </div>
            <p className="mt-2 text-lg font-bold leading-snug text-white">
              리얼티북과 함께 만드는
              <br />
              성공적인 중개 파트너십!
            </p>
          </div>

          <span className="mt-1 flex shrink-0 items-center gap-2 rounded-full bg-[#f5c344] py-2 pl-4 pr-2 text-xs font-bold text-[#16232E]">
            서비스 시작하기
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16232E] text-[#f5c344]">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </div>

        <p className="relative mt-2 text-xs leading-relaxed text-white/70">
          흩어진 중개 업무를 한 곳으로 정리.
          <br />
          투명하고, 간결한 자동화로 핵심 업무에만 집중하세요.
        </p>

        <div className="relative mt-3.5 flex flex-wrap gap-1.5">
          {BANNER_FEATURES.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-1 text-[11px] font-medium text-white/90"
            >
              {f.icon}
              {f.label}
            </span>
          ))}
        </div>
      </a>
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
    <main className="min-h-screen bg-[#F2F6FA] pb-10 text-[#16232E]">
      <div className="mx-auto mt-6 max-w-md px-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-512.png" alt="리얼티북" className="h-9 w-9 shrink-0 rounded-lg shadow-sm" />
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold text-[#0d3b52]">
                리얼티북 <span className="font-normal text-[#8B95A1]">RealtyBook</span>
              </span>
              <h1 className="mt-0.5 text-2xl font-bold">복비 계산기</h1>
            </span>
          </div>
          <p className="mt-1 text-sm text-[#8B95A1]">
            법정 상한요율 기준 부동산 중개보수를 계산해드립니다.
          </p>

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

          <button
            type="button"
            onClick={handleCopy}
            className="mt-4 w-full rounded-xl bg-[#14607F] py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
          >
            {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
          본 계산 결과는 법정 상한요율을 기준으로 한 참고용 안내이며, 실제 중개보수는 개업공인중개사와
          협의하여 결정됩니다. 일부 지자체는 조례가 다를 수 있어 정확한 금액은 관할 시·도 조례를
          확인하세요.
        </p>
      </div>

      <div className="mt-4">
        <PartnerBanner />
      </div>
    </main>
  );
}
