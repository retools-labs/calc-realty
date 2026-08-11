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
        className="relative block overflow-hidden transition active:scale-[0.99]"
        style={{
          borderRadius: 24,
          padding: "32px 34px 24px",
          background: "linear-gradient(125deg,#08203a 0%,#0d3b57 52%,#15719c 100%)",
          boxShadow: "0 18px 44px rgba(10,37,64,0.28)",
        }}
      >
        {/* 대각선 하이라이트 (우상단에서 은은하게 밝아지는 느낌) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(255deg,rgba(255,255,255,0.07) 0%,transparent 42%)" }}
        />
        {/* 카드 상단 가장자리 하이라이트 라인 */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent)",
          }}
        />
        {/* 우상단 동심원 장식 (큰 원 + 작은 원) — CTA 버튼 주변의 은은한 링 효과 */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{ top: -70, right: -70, width: 280, height: 280, border: "1px solid rgba(255,255,255,0.16)" }}
        />
        <div
          className="pointer-events-none absolute rounded-full"
          style={{ top: -30, right: -30, width: 160, height: 160, border: "1px solid rgba(255,255,255,0.13)" }}
        />

        {/* 배경 워터마크 RB 로고 (연하게, 하단 기준 — 본문과 안 겹치도록) */}
        <img
          src="/icons/rb-mark-white.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ width: 132, height: "auto", right: 24, bottom: 14, opacity: 0.08 }}
        />

        {/* 콘텐츠 컬럼 (라벨+CTA / 헤드라인 / 서브텍스트 / 칩) */}
        <div className="relative" style={{ maxWidth: "100%" }}>
          {/* 상단 라벨 + CTA 버튼 — 디자인 원본과 동일하게 flex-wrap:wrap 이라서
              폭이 좁아지면 겹치는 대신 버튼이 자연스럽게 다음 줄로 내려간다 */}
          <div
            className="flex flex-wrap items-center justify-between"
            style={{ gap: 14, marginBottom: 18 }}
          >
            <div className="flex items-center" style={{ gap: 9 }}>
              <span className="shrink-0" style={{ width: 20, height: 2, background: "#f5c433" }} />
              <span
                className="whitespace-nowrap"
                style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, color: "#f5c433" }}
              >
                REALTYBOOK
              </span>
            </div>

            <span
              className="inline-flex items-center"
              style={{
                gap: 10,
                background: "linear-gradient(180deg,#f8d055,#f0b81f)",
                borderRadius: 999,
                padding: "13px 14px 13px 26px",
                fontSize: 15,
                fontWeight: 800,
                color: "#0a2540",
                whiteSpace: "nowrap",
                boxShadow: "0 6px 16px rgba(8,32,58,0.55)",
              }}
            >
              서비스 시작하기
              <span
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#0d3b57",
                  color: "#f8d055",
                  fontSize: 15,
                  lineHeight: 1,
                }}
              >
                →
              </span>
            </span>
          </div>

          {/* 헤드라인 - 디자인 원본과 동일한 clamp(21px, 5.2vw, 28px), 단어 중간에서 안 끊기도록 keep-all */}
          <p
            className="text-white"
            style={{
              fontSize: "clamp(21px, 5.2vw, 28px)",
              fontWeight: 800,
              lineHeight: 1.3,
              letterSpacing: -0.7,
              marginBottom: 13,
              textWrap: "pretty",
              wordBreak: "keep-all",
            }}
          >
            리얼티북과 함께 만드는 성공적인 중개 파트너십!
          </p>

          {/* 서브텍스트 - 단어 중간에서 안 끊기도록 keep-all */}
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.65,
              color: "#9fbfd6",
              marginBottom: 34,
              textWrap: "pretty",
              wordBreak: "keep-all",
            }}
          >
            흩어진 중개 업무를 한 곳으로 정리. 투명하고, 간결한 자동화로 핵심 업무에만 집중하세요.
          </p>

          {/* 기능 칩 - space-between 대신 flex-start로, 줄바꿈돼도 칩이 이상하게 흩어지지 않도록 */}
          <div className="flex flex-wrap items-center" style={{ gap: 20, justifyContent: "flex-start" }}>
            {BANNER_FEATURES.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center"
              style={{
                gap: 7,
                background: "linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 999,
                padding: "7px 14px 7px 10px",
                backdropFilter: "blur(2px)",
              }}
            >
              <span style={{ width: 15, height: 15, color: "#93c9e4", display: "flex" }}>{f.icon}</span>
              <span
                style={{
                  color: "#e2eef5",
                  fontSize: 11.5,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  letterSpacing: -0.1,
                }}
              >
                {f.label}
              </span>
            </span>
            ))}
          </div>
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
