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

function RealtyBookMark({ size = 28 }: { size?: number }) {
  const gradId = "rb-mark-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4FC3E8" />
          <stop offset="1" stopColor="#0B3B66" />
        </linearGradient>
      </defs>
      <path
        d="M4 22 24 5l20 17"
        stroke={`url(#${gradId})`}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 19v20a2 2 0 0 0 2 2h27a2 2 0 0 0 2-2V19"
        stroke={`url(#${gradId})`}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="15"
        fill={`url(#${gradId})`}
      >
        RB
      </text>
    </svg>
  );
}

function RealtyBookLockup({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-white p-1">
        <RealtyBookMark size={24} />
      </div>
      <div className="leading-tight">
        <p className={`text-sm font-extrabold ${light ? "text-white" : "text-[#0B3B66]"}`}>리얼티북</p>
        <p className={`text-[9px] font-medium tracking-wide ${light ? "text-white/70" : "text-[#8B95A1]"}`}>
          REALTYBOOK
        </p>
      </div>
    </div>
  );
}

const HERO_FEATURES: { icon: string; label: string }[] = [
  { icon: "📋", label: "계약 관리" },
  { icon: "🏢", label: "임대료 납부" },
  { icon: "📍", label: "매물 검색" },
  { icon: "🤝", label: "투명 거래" },
];

function RealtyBookHero() {
  return (
    <a
      href={PARTNER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 pb-8 pt-6 text-white"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(135deg, #0B3B56, #12547A 55%, #1C7695)",
        backgroundSize: "16px 16px, 100% 100%",
      }}
    >
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          <RealtyBookLockup light />
          <span className="whitespace-nowrap rounded-lg bg-[#F0B429] px-3 py-1.5 text-xs font-bold text-[#0B3B56]">
            서비스 시작하기 →
          </span>
        </div>

        <div className="relative mt-6 flex items-center justify-between px-2">
          <div className="absolute left-5 right-5 top-[15px] h-px border-t border-dashed border-white/30" />
          {HERO_FEATURES.map((f) => (
            <div key={f.label} className="relative z-10 flex flex-col items-center gap-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm">
                {f.icon}
              </span>
              <span className="text-[10px] font-medium text-white/90">{f.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-right text-base font-bold leading-snug">
          리얼티북과 함께 투명하고
          <br />
          편리한 부동산 거래를 경험하세요!
        </p>
      </div>
    </a>
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
      <RealtyBookHero />

      <div className="mx-auto -mt-5 max-w-md px-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">복비 계산기</h1>
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
    </main>
  );
}
