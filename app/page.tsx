"use client";

import { useEffect, useRef, useState } from "react";
import BrokerageFeeCalculator from "@/components/BrokerageFeeCalculator";
import ProrateCalculator from "@/components/ProrateCalculator";
import MovingCostCalculator from "@/components/MovingCostCalculator";
import CapRateCalculator from "@/components/CapRateCalculator";
import PyeongCalculator from "@/components/PyeongCalculator";
import JeonseConversionCalculator from "@/components/JeonseConversionCalculator";
import { BASE_PATH } from "@/lib/basePath";
import { PRODUCT_NAME_SHORT } from "@/lib/productName";
import { track } from "@/lib/analytics";
import { PARTNER_URL, type Hook } from "@/lib/hook";

// PARTNER_URL 은 lib/hook.ts 에 있다. 후킹 두 줄이 같은 주소를 쓰므로 한 곳에서 정한다.

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
        onClick={() => {
          track("partner_banner_clicked");
          track("hook_clicked", { place: "banner" });
        }}
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
          src={`${BASE_PATH}/icons/rb-mark-white.png`}
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
                {PRODUCT_NAME_SHORT}
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
            {PRODUCT_NAME_SHORT}와 함께 만드는 성공적인 중개 파트너십!
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

type CalcTab = "fee" | "prorate" | "movingCost" | "capRate" | "pyeong" | "jeonseConversion";
type Mode = "customer" | "agent";

// PM 권고(v1.1): 상단 입력폼을 라이트 배경으로 바꾸고, 모드 스위치를 헤더 카드에서 분리.
// 탭은 모드와 무관하게 전부 개방하며, "실무용"을 켰을 때는 복비 탭 안에서만 추가 필드
// (공동중개 단타/양타, 정산비율 슬라이더 → 내 실수령액)가 열리는 방식으로 남긴다.
// 전월세 전환율·5% 상한 계산기(3.6): 법정 기준금리(2026-08-19 기준 2.75%) 확인 후 추가 완료.
const TABS: { value: CalcTab; label: string; icon: string }[] = [
  { value: "fee", label: "복비 계산", icon: "💰" },
  { value: "prorate", label: "잔금일 일할", icon: "📅" },
  { value: "movingCost", label: "취득세·부대", icon: "🏠" },
  { value: "capRate", label: "상가·수익률", icon: "🏢" },
  { value: "pyeong", label: "평수·평단가", icon: "📐" },
  { value: "jeonseConversion", label: "전월세·5%", icon: "🔄" },
];

export default function Home() {
  const [tab, setTab] = useState<CalcTab>("fee");
  const [mode, setMode] = useState<Mode>("customer");

  // [X-45] 한 화면에 후킹은 하나만 보인다(X-30 개정 정본).
  // 세 자리가 같은 곳으로 가므로 겹치면 안 되고, 늦은 신호가 이긴다.
  const [hook, setHook] = useState<Hook>(null);
  const bannerShown = useRef<Set<string>>(new Set());

  // [2026-09-04 R-11] 「계산까지 가는가」를 재는 자리.
  //
  // 이 계산기들에는 「계산하기」 버튼이 없다. 값을 넣는 즉시 결과가 다시 그려진다.
  // 그래서 결과에 도달했다는 신호는 버튼 클릭이 아니라 「의미 있는 값을 실제로
  // 넣었는가」다. 계산기 여섯 개를 각각 고치는 대신 담는 영역에서 입력을 한 번만
  // 받아 탭별로 첫 입력을 남긴다. 계산기 쪽 코드는 건드리지 않는다.
  const engagedTabs = useRef<Set<CalcTab>>(new Set());

  // 챙겨가기가 이미 이겼으면 정산 줄로 되돌리지 않는다.
  // track 을 setState 갱신 함수 안에서 부르지 않는다 — 개발 모드의 두 번 호출로 이벤트가 겹친다.
  function showHook(next: Exclude<Hook, null>) {
    if (hook === "carry" || hook === next) return;
    setHook(next);
    track("hook_shown", { place: next, tab, mode });
  }

  function selectTab(next: CalcTab) {
    setTab(next);
    setHook(null);
    track("calc_tab_selected", { tab: next, mode });
  }

  function selectMode(next: Mode) {
    setMode(next);
    setHook(null);
    track("calc_mode_selected", { mode: next, tab });
  }

  // 입력 이벤트는 위로 올라오므로(버블링) 담는 div 에서 한 번만 받으면 된다.
  function handleCalcInput() {
    setHook(null); // 값을 다시 만지면 후킹을 접는다. 그 사람은 아직 계산 중이다
    if (engagedTabs.current.has(tab)) return;
    engagedTabs.current.add(tab);
    track("calc_engaged", { tab, mode });
  }

  // 파트너 배너는 공인중개사 실무용에서만 보이고, 후킹 줄이 떠 있는 동안 접힌다.
  // 일반고객은 중개 업무를 정리할 사람이 아니다. 자리를 거르지 못하면 문구를 고쳐도 소용이 없다.
  const bannerVisible = mode === "agent" && hook === null;

  useEffect(() => {
    if (!bannerVisible) return;
    const key = `${tab}|${mode}`;
    if (bannerShown.current.has(key)) return;
    bannerShown.current.add(key);
    track("hook_shown", { place: "banner", tab, mode });
  }, [bannerVisible, tab, mode]);

  return (
    <main className="min-h-screen bg-[#F2F6FA] pb-10 text-[#16232E]">
      <div className="mx-auto mt-6 max-w-md px-4">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-navy">부동산 계산기</span>
            <span className="text-sm font-semibold text-[#8B95A1]">v1.1</span>
          </span>
          <span className="rounded-full bg-gradient-to-b from-[#f8d055] to-[#f0b81f] px-2.5 py-1 text-[11px] font-extrabold text-navy shadow-sm">
            FREE
          </span>
        </div>
        <p className="mt-1 px-1 text-xs text-[#8B95A1]">복비·잔금일 일할계산부터 취득세까지 한번에</p>

        <div className="mt-3 rounded-2xl bg-white p-1 shadow-sm">
          <div className="grid grid-cols-2 gap-1">
            {(
              [
                { value: "customer", label: "일반고객용" },
                { value: "agent", label: "공인중개사 실무용" },
              ] as { value: Mode; label: string }[]
            ).map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => selectMode(m.value)}
                className={`rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                  mode === m.value ? "bg-navy text-[#f5c433] shadow-sm" : "text-[#8B95A1]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => selectTab(t.value)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-3 text-[11px] font-semibold transition sm:text-xs ${
                tab === t.value ? "bg-navy text-white shadow-sm" : "bg-white text-[#4E5968] shadow-sm"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="leading-tight">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3" onInput={handleCalcInput}>
          {tab === "fee" && (
            <BrokerageFeeCalculator mode={mode} hook={hook} showHook={showHook} />
          )}
          {tab === "prorate" && <ProrateCalculator mode={mode} />}
          {tab === "movingCost" && <MovingCostCalculator />}
          {tab === "capRate" && <CapRateCalculator />}
          {tab === "pyeong" && <PyeongCalculator />}
          {tab === "jeonseConversion" && <JeonseConversionCalculator />}
        </div>
      </div>

      {bannerVisible && (
        <div className="mt-4">
          <PartnerBanner />
        </div>
      )}
    </main>
  );
}
