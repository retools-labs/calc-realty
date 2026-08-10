// 부동산 중개보수(복비) 계산 엔진
// 근거: 공인중개사법 시행규칙 제20조 + 각 시·도 주택중개보수 조례
// (본 앱은 서울특별시 조례 기준 요율표를 기본값으로 사용합니다. 대부분의 광역자치단체가
//  동일한 표를 채택하고 있으나, 일부 지역은 조례가 다를 수 있어 최종 확정 전 관할 지자체
//  조례를 확인하시길 권장합니다.)

export type PropertyType = "house" | "officetelSmall" | "officetelOther" | "other";
export type DealType = "sale" | "lease";
export type VatType = "general" | "simplified" | "exempt";

export interface CalcInput {
  propertyType: PropertyType;
  dealType: DealType;
  price: number; // 매매가 또는 (환산 전) 임대차 거래금액 산정을 위한 기초금액
  deposit?: number; // 월세 보증금 (월세 거래 시)
  monthlyRent?: number; // 월세 (월세 거래 시)
  vatType: VatType;
  negotiatedRate?: number; // 협의요율(%) - 입력 시 상한요율 대신 적용 (상한 초과 불가)
}

export interface RateBracket {
  label: string;
  min: number;
  max: number; // Infinity 가능
  rate: number; // 0.006 = 0.6%
  cap: number | null; // 한도액(원), 없으면 null
}

// 주택 매매·교환
export const HOUSE_SALE_BRACKETS: RateBracket[] = [
  { label: "5천만원 미만", min: 0, max: 50_000_000, rate: 0.006, cap: 250_000 },
  { label: "5천만원~2억원 미만", min: 50_000_000, max: 200_000_000, rate: 0.005, cap: 800_000 },
  { label: "2억원~9억원 미만", min: 200_000_000, max: 900_000_000, rate: 0.004, cap: null },
  { label: "9억원~12억원 미만", min: 900_000_000, max: 1_200_000_000, rate: 0.005, cap: null },
  { label: "12억원~15억원 미만", min: 1_200_000_000, max: 1_500_000_000, rate: 0.006, cap: null },
  { label: "15억원 이상", min: 1_500_000_000, max: Infinity, rate: 0.007, cap: null },
];

// 주택 임대차 등 (매매·교환 이외: 전세/월세)
export const HOUSE_LEASE_BRACKETS: RateBracket[] = [
  { label: "5천만원 미만", min: 0, max: 50_000_000, rate: 0.005, cap: 200_000 },
  { label: "5천만원~1억원 미만", min: 50_000_000, max: 100_000_000, rate: 0.004, cap: 300_000 },
  { label: "1억원~6억원 미만", min: 100_000_000, max: 600_000_000, rate: 0.003, cap: null },
  { label: "6억원~12억원 미만", min: 600_000_000, max: 1_200_000_000, rate: 0.004, cap: null },
  { label: "12억원~15억원 미만", min: 1_200_000_000, max: 1_500_000_000, rate: 0.005, cap: null },
  { label: "15억원 이상", min: 1_500_000_000, max: Infinity, rate: 0.006, cap: null },
];

export function findBracket(price: number, brackets: RateBracket[]): RateBracket {
  return (
    brackets.find((b) => price >= b.min && price < b.max) ?? brackets[brackets.length - 1]
  );
}

// 월세 → 중개보수 산정용 환산 거래금액
// 보증금 + (월세 × 100), 단 합산액이 5천만원 미만이면 보증금 + (월세 × 70)
export function convertMonthlyRentToDealAmount(deposit: number, monthlyRent: number): number {
  const x100 = deposit + monthlyRent * 100;
  if (x100 < 50_000_000) {
    return deposit + monthlyRent * 70;
  }
  return x100;
}

export interface CalcResult {
  dealAmount: number; // 산정 기준 거래금액(월세는 환산금액)
  capRate: number; // 상한요율
  capFee: number; // 상한요율 적용 시 보수액(한도액 적용 후)
  bracketLabel: string;
  cap: number | null;
  appliedRate: number; // 실제 계산에 사용된 요율(협의요율 있으면 그것, 없으면 상한요율)
  appliedFee: number; // 요율 적용 후 보수액 (한도액 적용 후)
  vatRate: number;
  vat: number;
  totalWithVat: number;
}

const VAT_RATES: Record<VatType, number> = {
  general: 0.1,
  simplified: 0.04, // 업종별 부가가치율 약 40% 가정 시 실효세율 근사치 (참고용, 실제는 사업자 신고에 따라 다를 수 있음)
  exempt: 0,
};

export function calcBrokerageFee(input: CalcInput): CalcResult {
  const { propertyType, dealType, price, deposit = 0, monthlyRent = 0, vatType, negotiatedRate } = input;

  let dealAmount: number;
  if (dealType === "lease" && monthlyRent > 0) {
    dealAmount = convertMonthlyRentToDealAmount(deposit, monthlyRent);
  } else if (dealType === "lease") {
    dealAmount = deposit || price;
  } else {
    dealAmount = price;
  }

  let capRate: number;
  let cap: number | null;
  let bracketLabel: string;

  if (propertyType === "house") {
    const brackets = dealType === "sale" ? HOUSE_SALE_BRACKETS : HOUSE_LEASE_BRACKETS;
    const b = findBracket(dealAmount, brackets);
    capRate = b.rate;
    cap = b.cap;
    bracketLabel = b.label;
  } else if (propertyType === "officetelSmall") {
    capRate = dealType === "sale" ? 0.005 : 0.004;
    cap = null;
    bracketLabel = "오피스텔(전용 85㎡ 이하, 요건 충족)";
  } else if (propertyType === "officetelOther") {
    capRate = 0.009;
    cap = null;
    bracketLabel = "오피스텔(그 외)";
  } else {
    capRate = 0.009;
    cap = null;
    bracketLabel = "토지·상가 등 주택 외 부동산";
  }

  const rawCapFee = dealAmount * capRate;
  const capFee = cap !== null ? Math.min(rawCapFee, cap) : rawCapFee;

  let appliedRate = capRate;
  if (negotiatedRate !== undefined && negotiatedRate > 0) {
    appliedRate = Math.min(negotiatedRate / 100, capRate);
  }
  const rawAppliedFee = dealAmount * appliedRate;
  const appliedFee = cap !== null ? Math.min(rawAppliedFee, cap) : rawAppliedFee;

  const vatRate = VAT_RATES[vatType];
  const vat = Math.round(appliedFee * vatRate);
  const totalWithVat = Math.round(appliedFee) + vat;

  return {
    dealAmount,
    capRate,
    capFee: Math.round(capFee),
    bracketLabel,
    cap,
    appliedRate,
    appliedFee: Math.round(appliedFee),
    vatRate,
    vat,
    totalWithVat,
  };
}

export function formatKRW(value: number): string {
  const normalized = Object.is(value, -0) ? 0 : value;
  return normalized.toLocaleString("ko-KR") + "원";
}
