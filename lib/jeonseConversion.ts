// 전월세 전환율 상한 + 계약갱신청구권 5% 증액 상한 계산 엔진
//
// 근거 1) 주택임대차보호법 제7조의2, 같은 법 시행령 제9조(월차임 전환 시 산정률)
//   보증금의 전부/일부를 월 단위 차임으로 전환하는 경우, 그 전환되는 금액에 곱하는 비율은
//   ① 연 1할(10%)과 ② "한국은행 공시 기준금리 + 대통령령으로 정하는 이율(현재 연 2%)" 중
//   "낮은" 비율을 초과할 수 없다(시행령 제9조 제1항 1할, 제2항 기준금리+2%p).
//   → 두 값 중 낮은 쪽이 그 시점의 법정 상한 전환율이 된다.
//
// 근거 2) 주택임대차보호법 제6조의3(계약갱신 요구 등) 제3항 + 같은 법 시행령 제8조
//   임차인이 계약갱신요구권을 행사해 갱신되는 경우, 차임이나 보증금의 증액청구는 약정한
//   차임 등의 20분의 1(=5%) 금액을 초과하지 못한다. 이 5%는 기준금리와 무관한 고정 상한이다.
//
// ⚠️ 기준금리는 한국은행 금융통화위원회가 연 8회(통상 매 6주) 회의에서 바꿀 수 있다.
//   실제 서비스에서는 `app/api/base-rate`가 한국은행 ECOS Open API로 매번 최신값을 실시간
//   조회해서 쓰므로 사람이 수동으로 갱신할 필요가 없다. 아래 FALLBACK_BASE_RATE_PERCENT는
//   ECOS 인증키가 없거나(로컬 개발 등) API 호출이 실패했을 때만 쓰이는 최후의 안전값이다.
//   마지막으로 사람이 직접 확인한 값: 2026-08-19 확인, 2026-07-16 금통위 결정 기준 연 2.75%
//   (2023년 1월 이후 첫 인상). 이 폴백값이 오래돼 보이면(반년 이상) 한국은행 발표
//   (https://www.bok.or.kr/portal/singl/baseRate/list.do)로 재확인해서 갱신해줄 것.

export const FALLBACK_BASE_RATE_PERCENT = 2.75; // ECOS 실시간 조회 실패 시 대체값
export const FALLBACK_BASE_RATE_DATE = "2026-07-16"; // 위 폴백값이 결정된 금통위 회의일

export const STATUTORY_CAP_RATE_PERCENT = 10; // 시행령 제9조 제1항: 연 1할
export const BASE_RATE_MARGIN_PERCENT = 2; // 시행령 제9조 제2항: 기준금리 + 연 2%p
export const RENEWAL_INCREASE_CAP_PERCENT = 5; // 시행령 제8조: 갱신 시 증액청구 상한 5%(20분의 1)

// 특정 시점 기준금리(%)로 법정 전환율 상한(%) = min(연 1할, 기준금리 + 2%p) 계산.
// baseRatePercent를 생략하면 폴백값을 쓰지만, 실제 화면에서는 항상
// `app/api/base-rate`로 조회한 실시간 값을 넘겨서 호출해야 한다.
export function getStatutoryConversionRatePercent(baseRatePercent: number = FALLBACK_BASE_RATE_PERCENT): number {
  return Math.min(STATUTORY_CAP_RATE_PERCENT, baseRatePercent + BASE_RATE_MARGIN_PERCENT);
}

export type ConversionDirection = "depositToRent" | "rentToDeposit";

export interface ConversionInput {
  direction: ConversionDirection;
  // depositToRent: 보증금 일부를 월세로 낮출 때 — 낮추는 보증금 차액에 전환율 적용
  // rentToDeposit: 월세를 보증금으로 환산해서 비교할 때
  baseDeposit: number; // 기준이 되는 현재 보증금(전세보증금 또는 월세 계약의 보증금)
  targetDepositOrRent: number; // depositToRent: 전환 후 낮출 보증금 / rentToDeposit: 현재 월세
  conversionRatePercent: number; // 적용할 전환율(%) — 기본은 법정 상한, 사용자가 낮게 조정 가능
  currentBaseRatePercent?: number; // 실시간 한국은행 기준금리(%) — 법정 상한 판정 기준
}

export interface ConversionResult {
  convertedAmount: number; // depositToRent: 보증금 차액 / rentToDeposit: 환산 대상 월세 총액 기준
  monthlyRent: number; // depositToRent 결과 월세 / rentToDeposit 모드에선 입력 월세 그대로
  equivalentDeposit: number; // rentToDeposit 결과 환산 보증금 / depositToRent 모드에선 낮춘 후 보증금
  exceedsStatutoryCap: boolean; // 사용자가 지정한 전환율이 법정 상한을 초과하는지
  statutoryCapPercent: number;
}

export function calcConversion(input: ConversionInput): ConversionResult | null {
  const { direction, baseDeposit, targetDepositOrRent, conversionRatePercent, currentBaseRatePercent } = input;
  if (conversionRatePercent <= 0) return null;

  const statutoryCapPercent = getStatutoryConversionRatePercent(currentBaseRatePercent);
  const exceedsStatutoryCap = conversionRatePercent > statutoryCapPercent + 1e-9;

  if (direction === "depositToRent") {
    // targetDepositOrRent = 전환 후 낮출 보증금(더 작은 값)
    const diff = Math.max(0, baseDeposit - targetDepositOrRent);
    const monthlyRent = Math.round((diff * (conversionRatePercent / 100)) / 12);
    return {
      convertedAmount: diff,
      monthlyRent,
      equivalentDeposit: targetDepositOrRent,
      exceedsStatutoryCap,
      statutoryCapPercent,
    };
  }

  // rentToDeposit = targetDepositOrRent는 현재 월세
  const monthlyRent = targetDepositOrRent;
  const equivalentExtra = Math.round((monthlyRent * 12) / (conversionRatePercent / 100));
  return {
    convertedAmount: monthlyRent * 12,
    monthlyRent,
    equivalentDeposit: baseDeposit + equivalentExtra,
    exceedsStatutoryCap,
    statutoryCapPercent,
  };
}

export interface RenewalCapInput {
  currentDeposit: number;
  currentMonthlyRent: number; // 전세면 0
}

export interface RenewalCapResult {
  maxDeposit: number;
  maxMonthlyRent: number;
  depositIncrease: number;
  monthlyRentIncrease: number;
}

// 계약갱신청구권 행사 시 증액 상한(5%) 적용 후 최대 보증금/월세
export function calcRenewalCap(input: RenewalCapInput): RenewalCapResult {
  const { currentDeposit, currentMonthlyRent } = input;
  const multiplier = 1 + RENEWAL_INCREASE_CAP_PERCENT / 100;
  const maxDeposit = Math.round(currentDeposit * multiplier);
  const maxMonthlyRent = Math.round(currentMonthlyRent * multiplier);
  return {
    maxDeposit,
    maxMonthlyRent,
    depositIncrease: maxDeposit - currentDeposit,
    monthlyRentIncrease: maxMonthlyRent - currentMonthlyRent,
  };
}
