"use client";

import { useState } from "react";
import BrokerageFeeCalculator from "@/components/BrokerageFeeCalculator";
import ProrateCalculator from "@/components/ProrateCalculator";

const PARTNER_URL = "https://apple-realty.vercel.app/partner";

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
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(255deg,rgba(255,255,255,0.07) 0%,transparent 42%)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full"
          style={{ top: -70, right: -70, width: 280, height: 280, border: "1px solid rgba(255,255,255,0.16)" }}
        />
        <div
          className="pointer-events-none absolute rounded-full"
          style={{ top: -30, right: -30, width: 160, height: 160, border: "1px solid rgba(255,255,255,0.13)" }}
        />

        <img
          src="/icons/rb-mark-white.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ width: 132, height: "auto", right: 24, bottom: 14, opacity: 0.08 }}
        />

        <div className="relative" style={{ maxWidth: "100%" }}>
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
            흩어진 중개 업무를 한 곳으로 정리.
            <br />
            <span style={{ color: "#e4eff6", fontWeight: 600 }}>
              투명하고, 간결한 자동화로 핵심 업무에만 집중하세요.
            </span>
          </p>

          <div className="grid" style={{ gap: 10, gridTemplateColumns: "max-content max-content" }}>
            {BANNER_FEATURES.map((f, i) => (
              <span
                key={f.label}
                className="inline-flex items-center"
                style={{
                  gap: 7,
                  gridColumn: i === 0 ? "1 / -1" : undefined,
                  justifySelf: "start",
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

type CalcTab = "fee" | "prorate";

const TABS: { value: CalcTab; label: string }[] = [
  { value: "fee", label: "복비 계산기" },
  { value: "prorate", label: "일할 계산기" },
];

export default function Home() {
  const [tab, setTab] = useState<CalcTab>("fee");

  return (
    <main className="min-h-screen bg-[#F2F6FA] pb-10 text-[#16232E]">
      <div className="mx-auto mt-6 max-w-md px-4">
        <div className="flex items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
          <img src="/icons/icon-512.png" alt="리얼티북" className="h-9 w-9 shrink-0 rounded-lg shadow-sm" />
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold text-[#0d3b52]">
              리얼티북
              <sup className="ml-0.5 text-[10px] font-normal text-[#8B95A1]" title="상표 출원 중 (출원번호 40-2026-0168198)">
                TM
              </sup>{" "}
              <span className="font-normal text-[#8B95A1]">RealtyBook</span>
            </span>
            <span className="mt-0.5 text-sm text-[#8B95A1]">부동산 계산 툴킷</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                tab === t.value ? "bg-[#14607F] text-white" : "text-[#4E5968]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          {tab === "fee" ? <BrokerageFeeCalculator /> : <ProrateCalculator />}
        </div>
      </div>

      <div className="mt-4">
        <PartnerBanner />
      </div>
    </main>
  );
}
