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
import { HookProvider } from "@/lib/hookContext";
import { HOUSE_LEASE_BRACKETS, HOUSE_SALE_BRACKETS, VAT_RATES, formatKRW } from "@/lib/calc";

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
          src={`${BASE_PATH}/icons/mark-white.png`}
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

function RateTable({ brackets }: { brackets: typeof HOUSE_SALE_BRACKETS }) {
  return (
    <div className="overflow-x-auto border-y border-[#E5E8EB]">
      <table className="w-full table-fixed text-left text-xs leading-relaxed text-[#4E5968]">
        <thead className="bg-[#F8FAFC] text-[#333D4B]">
          <tr>
            <th scope="col" className="w-[48%] px-2 py-2 font-semibold">거래금액</th>
            <th scope="col" className="w-[23%] px-2 py-2 font-semibold">상한요율</th>
            <th scope="col" className="w-[29%] px-2 py-2 font-semibold">한도액</th>
          </tr>
        </thead>
        <tbody>
          {brackets.map((bracket) => (
            <tr key={bracket.label} className="border-t border-[#E5E8EB]">
              <td className="break-keep px-2 py-2">{bracket.label}</td>
              <td className="px-2 py-2">{(bracket.rate * 100).toFixed(1)}%</td>
              <td className="break-keep px-2 py-2">{bracket.cap === null ? "없음" : formatKRW(bracket.cap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RealtyGuideSection() {
  return (
    <section className="mx-auto mt-10 max-w-md px-4 pb-4 text-sm leading-7 text-[#4E5968]" aria-labelledby="realty-guide-title">
      <h2 id="realty-guide-title" className="text-lg font-bold text-[#16232E]">부동산 계산기, 이렇게 사용하세요</h2>
      <p className="mt-3">
        먼저 복비 계산 탭에서 매매·전세·월세 중 거래 유형을 고르고, 주택·오피스텔·상가·토지 중 매물 유형을 선택하세요.
        매매는 매매가를, 전세는 보증금을 입력하면 됩니다. 월세는 보증금과 월세를 함께 넣어 중개보수 산정용 거래금액으로 환산합니다.
        부가세 구분까지 선택하면 상한요율 기준 보수와 부가세를 더한 금액을 바로 확인할 수 있습니다. 잔금일 일할, 취득세·부대비용,
        상가 수익률, 평수·평단가, 전월세 전환율 탭도 같은 화면에서 필요한 항목만 입력해 이용할 수 있습니다.
      </p>

      <h3 className="mt-5 text-base font-semibold text-[#333D4B]">결과를 볼 때 확인할 점</h3>
      <p className="mt-2">
        복비 계산 결과에는 산정 거래금액, 상한요율 기준 보수, 부가세, 최종 지급액이 차례로 표시됩니다. 입력한 거래 유형과
        매물 유형이 계약서의 내용과 같은지 먼저 확인하세요. 특히 월세는 보증금만으로 계산하지 않고 월세를 환산해 거래금액을
        정하므로, 보증금·월세 중 하나라도 바뀌면 결과도 다시 확인해야 합니다. 결과 텍스트 복사 기능은 협의 전 금액을
        정리해 두는 데 쓸 수 있지만, 계약서에 적을 보수와 부가세 포함 여부는 중개사무소와 다시 맞춰 보는 것이 안전합니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-[#16232E]">주택 중개보수 상한요율</h2>
      <p className="mt-3">
        아래 표는 이 계산기가 사용하는 주택 기준 상한요율입니다. 상한요율은 중개보수로 받을 수 있는 최대 비율이며,
        실제 보수는 이 범위 안에서 개업공인중개사와 협의해 정합니다. 한도액이 있는 구간은 거래금액에 요율을 곱한 금액이
        한도액을 넘더라도 한도액까지만 적용합니다.
      </p>

      <h3 className="mt-5 text-base font-semibold text-[#333D4B]">매매·교환</h3>
      <div className="mt-2">
        <RateTable brackets={HOUSE_SALE_BRACKETS} />
      </div>

      <h3 className="mt-6 text-base font-semibold text-[#333D4B]">전세·월세</h3>
      <p className="mt-2">
        전세는 보증금을 거래금액으로 봅니다. 월세는 「보증금 + 월세 × 100」으로 환산한 금액을 기준으로 구간을 찾고, 이 금액이 5천만원 미만이면 「보증금 + 월세 × 70」을 씁니다.
        따라서 같은 보증금이라도 월세가 있으면 적용 구간과 상한 보수가 달라질 수 있습니다.
      </p>
      <div className="mt-2">
        <RateTable brackets={HOUSE_LEASE_BRACKETS} />
      </div>
      <p className="mt-3">
        표의 거래금액은 중개보수 산정 기준입니다. 전세는 보증금으로 바로 판단하지만, 월세는 환산한 금액으로 판단하므로
        보증금이 낮아도 월세가 있으면 더 높은 구간이 적용될 수 있습니다. 반대로 계산기에서 나온 구간이 예상과 다르다면
        거래 유형을 전세가 아닌 월세로 선택했는지, 보증금과 월세를 모두 입력했는지 확인해 보세요. 매매와 임대차는
        같은 금액이라도 적용 표가 다르므로 계약 종류를 바꿔 비교하면 안 됩니다. 계약금이나 중도금처럼 이미 지급한 금액이
        아니라, 계약에서 정한 전체 거래금액을 기준으로 입력하는지도 함께 확인하세요. 입력값이 정확해야 결과도 정확해집니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-[#16232E]">부가세는 어떻게 붙나요?</h2>
      <p className="mt-3">
        중개보수와 부가세는 구분해 보세요. 이 계산기는 일반과세를 중개보수의 {(VAT_RATES.general * 100).toFixed(0)}%로 계산해 표시합니다. 간이과세는
        업종별 부가가치율을 반영한 세액이 달라 정해진 부가세율이 없어서, 참고용으로 중개보수의 {(VAT_RATES.simplified * 100).toFixed(0)}% 정도로
        근사해 보여 줍니다. 면세·생략을 고르면 부가세를 더하지 않습니다. 실제 부가세 부담은 중개사무소의 과세 유형과 신고
        방식에 따라 달라지므로, 계산 결과는 거래 전에 중개사무소에 확인하는 용도로 보는 편이 좋습니다.
      </p>

      <h2 className="mt-8 text-lg font-bold text-[#16232E]">자주 묻는 질문</h2>
      <div className="mt-3 space-y-5">
        <div>
          <h3 className="font-semibold text-[#333D4B]">상한요율은 반드시 내야 하는 요율인가요?</h3>
          <p>아닙니다. 상한요율은 받을 수 있는 최대 기준입니다. 상한을 넘을 수는 없지만, 그보다 낮은 보수는 거래 당사자와 중개사가 협의할 수 있습니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#333D4B]">협의로 더 깎을 수 있나요?</h3>
          <p>가능합니다. 계산기에서 보이는 상한 보수보다 낮은 금액이나 요율을 정할 수 있습니다. 다만 합의한 보수와 부가세 포함 여부는 계약 전에 분명히 확인하세요.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#333D4B]">오피스텔은 왜 주택과 다른가요?</h3>
          <p>오피스텔은 전용면적 85㎡ 이하이면서 전용 부엌·화장실·목욕시설을 갖춘 경우 등 요건에 따라 적용 요율이 달라집니다. 그래서 계산기에서도 주택과 구분해 선택하도록 했습니다. 요건 충족 여부는 계산기가 확인하지 못하니 계약 전 직접 확인하세요.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#333D4B]">잔금일 일할계산이란 무엇인가요?</h3>
          <p>월세나 관리비를 한 달 전체가 아닌 실제 거주·사용 일수만큼 나누어 정산하는 방식입니다. 잔금일과 계약 조건을 입력하면 일별 금액을 기준으로 계산합니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#333D4B]">지자체 조례가 다르면 어떻게 하나요?</h3>
          <p>이 계산기는 서울특별시 조례 기준 요율표를 기본으로 사용합니다. 지역에 따라 조례가 다를 수 있으므로 거래 지역의 관할 시·도 조례를 함께 확인하세요.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#333D4B]">중개보수는 언제 내나요?</h3>
          <p>보통 계약의 마무리 시점에 지급하지만, 정확한 시점과 방법은 거래 당사자와 중개사가 정한 약정에 따릅니다. 영수증과 지급 조건을 남겨 두면 나중에 확인하기 좋습니다.</p>
        </div>
      </div>

      <p className="mt-8 text-xs leading-6 text-[#8B95A1]">
        이 안내와 계산 결과는 법정 상한 기준을 참고하기 위한 것입니다. 실제 중개보수는 개업공인중개사와 협의하고 관할 지자체 조례를 확인해 결정하세요.
      </p>
    </section>
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
    // 일반고객 모드에는 파트너로 보내는 자리를 두지 않는다 (지시 039 · 배너와 같은 판정).
    // 후킹 두 줄의 목적지가 배너와 같은 /partner 이므로 조건도 같아야 한다.
    if (mode !== "agent") return;
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

        {/* [X-45 3단계] 후킹 상태는 이 한 곳이 쥐고, 여섯 계산기는 useHook() 으로 읽는다.
            prop 으로 내리면 여섯 곳에 같은 두 줄이 늘어서고 한 곳만 빠져도 그 탭에서만 조용히 사라진다. */}
        <HookProvider value={{ hook, showHook, tab, mode }}>
          <div className="mt-3" onInput={handleCalcInput}>
            {tab === "fee" && <BrokerageFeeCalculator mode={mode} />}
            {tab === "prorate" && <ProrateCalculator mode={mode} />}
            {tab === "movingCost" && <MovingCostCalculator />}
            {tab === "capRate" && <CapRateCalculator />}
            {tab === "pyeong" && <PyeongCalculator />}
            {tab === "jeonseConversion" && <JeonseConversionCalculator />}
          </div>
        </HookProvider>
      </div>

      {bannerVisible && (
        <div className="mt-4">
          <PartnerBanner />
        </div>
      )}

      <RealtyGuideSection />
    </main>
  );
}
