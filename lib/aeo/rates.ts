import {
  calcBrokerageFee,
  convertMonthlyRentToDealAmount,
  formatKRW,
  HOUSE_LEASE_BRACKETS,
  HOUSE_SALE_BRACKETS,
  type DealType,
  type PropertyType,
  type RateBracket,
} from "@/lib/calc";
import { OFFICIAL_CALCULATOR_URL, OFFICIAL_RATES_URL } from "@/lib/aeo/canonical";
import { CALC_PRODUCT_NAME } from "@/lib/productName";
import { RATE_TABLE_BASIS_DATE, serializeJsonLd } from "@/lib/aeo/structuredData";

export type HouseRateRow = {
  label: string;
  capRate: number;
  rateLabel: string;
  cap: number | null;
  capLabel: string;
};

export type OtherPropertyRateRow = {
  propertyLabel: string;
  propertyType: PropertyType;
  dealType: DealType;
  dealTypeLabel: string;
  bracketLabel: string;
  capRate: number;
  rateLabel: string;
};

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function buildHouseRateRows(brackets: RateBracket[]): HouseRateRow[] {
  return brackets.map((bracket) => ({
    label: bracket.label,
    capRate: bracket.rate,
    rateLabel: formatRate(bracket.rate),
    cap: bracket.cap,
    capLabel: bracket.cap === null ? "한도 없음" : formatKRW(bracket.cap),
  }));
}

function buildOtherPropertyRateRow(
  propertyLabel: string,
  propertyType: PropertyType,
  dealType: DealType,
  dealTypeLabel: string,
): OtherPropertyRateRow {
  const result = calcBrokerageFee({ propertyType, dealType, price: 100_000_000, vatType: "exempt" });

  return {
    propertyLabel,
    propertyType,
    dealType,
    dealTypeLabel,
    bracketLabel: result.bracketLabel,
    capRate: result.capRate,
    rateLabel: formatRate(result.capRate),
  };
}

export const HOUSE_SALE_RATE_ROWS = buildHouseRateRows(HOUSE_SALE_BRACKETS);
export const HOUSE_LEASE_RATE_ROWS = buildHouseRateRows(HOUSE_LEASE_BRACKETS);

export const OTHER_PROPERTY_RATE_ROWS = [
  buildOtherPropertyRateRow("오피스텔(전용 85㎡ 이하·요건 충족)", "officetelSmall", "sale", "매매"),
  buildOtherPropertyRateRow("오피스텔(전용 85㎡ 이하·요건 충족)", "officetelSmall", "lease", "임대차"),
  buildOtherPropertyRateRow("오피스텔(그 외)", "officetelOther", "sale", "매매·임대차"),
  buildOtherPropertyRateRow("토지·상가 등 주택 외", "other", "sale", "매매·임대차"),
];

export const MONTHLY_RENT_CONVERSION_TEXT =
  "보증금 + 월세×100, 합계가 5천만 원 미만이면 보증금 + 월세×70";

export const RATE_TABLE_SOURCES = [
  "공인중개사법 시행규칙 제20조",
  "서울특별시 주택 중개보수 등에 관한 조례",
];

export function formatRateTableBasisDate(basisDate = RATE_TABLE_BASIS_DATE): string {
  const [year, month, day] = basisDate.split("-");
  return `기준일 ${year}년 ${Number(month)}월 ${Number(day)}일(요율표 확인일)`;
}

export const RATES_SUMMARY_TEXT = `서울특별시 조례 기준 · ${formatRateTableBasisDate()} · 출처 ${RATE_TABLE_SOURCES.join(", ")}`;

export const RATES_GUIDANCE_TEXT =
  "상한요율은 받을 수 있는 최대 기준이며, 실제 중개보수는 그 범위 안에서 협의할 수 있습니다. 부가세는 별도로 붙을 수 있습니다. 이 표는 서울특별시 조례 기준이므로, 거래 지역의 관할 지자체 조례도 확인하세요.";

export const RATES_LOCAL_ORDINANCE_NOTICE =
  "이 앱은 서울특별시 조례 기준 요율표를 기본값으로 사용합니다. 대부분의 광역자치단체가 같은 표를 채택하지만, 일부 지역은 조례가 다를 수 있으므로 최종 확정 전 관할 지자체 조례를 확인하세요.";

export function getRatesStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "부동산 중개보수(복비) 상한요율표",
    url: OFFICIAL_RATES_URL,
    dateModified: RATE_TABLE_BASIS_DATE,
    inLanguage: "ko",
    isPartOf: {
      "@type": "WebApplication",
      name: CALC_PRODUCT_NAME,
      url: OFFICIAL_CALCULATOR_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://retools.kr/#org",
      name: "리툴스",
      url: "https://retools.kr/",
    },
  };
}

export function getRatesStructuredDataJson(): string {
  return serializeJsonLd(getRatesStructuredData());
}

export function monthlyRentConversionMatchesExamples(): boolean {
  return (
    convertMonthlyRentToDealAmount(10_000_000, 300_000) === 31_000_000 &&
    convertMonthlyRentToDealAmount(50_000_000, 500_000) === 100_000_000
  );
}
