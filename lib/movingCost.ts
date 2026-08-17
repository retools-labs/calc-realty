// 이사(취득/입주) 총 부대비용 계산 엔진
//
// 매매: 중개보수 + 취득세 + 지방교육세 + 농어촌특별세 + 법무사수수료(추정) + 국민주택채권 할인비용
// 전월세: 중개보수 + 전세보증금반환보증료(HUG/HF, 추정) + 이사/입주청소 비용
//
// ⚠️ 취득세는 주택 수·조정대상지역 여부·가격에 따라 세율이 복잡하게 갈리고(1~12%),
// 조정대상지역 지정 현황은 수시로 바뀝니다. 아래 로직은 2020.8.12 다주택자 중과 개편
// 이후의 표준 구조를 단순화해 반영한 "참고용 추정치"이며, 실제 신고·납부 세액은
// 취득 시점 기준 관할 지자체·법무사 확인이 반드시 필요합니다. 법무사수수료·채권할인비용도
// 사무소/지역/시점마다 달라 근사치로만 제공합니다.

export type HouseCount = 1 | 2 | 3; // 3은 "3주택 이상"을 의미

export interface AcquisitionTaxResult {
  rate: number; // 취득세율 (0.01 = 1%)
  tax: number; // 취득세액
  localEduTaxRate: number;
  localEduTax: number; // 지방교육세
  ruralTaxRate: number;
  ruralTax: number; // 농어촌특별세
  totalTax: number; // 위 3종 합계
}

// 1주택자(또는 2주택 비조정지역) 기준 가격 구간별 세율: 6억 이하 1%, 6~9억 선형 1~3%, 9억 초과 3%
function baseAcquisitionRate(price: number): number {
  const eok = price / 100_000_000; // 억 단위
  if (eok <= 6) return 0.01;
  if (eok >= 9) return 0.03;
  const ratePercent = eok * (2 / 3) - 3; // 6억=1%, 9억=3% 선형 보간
  return ratePercent / 100;
}

export function calcAcquisitionTax(
  price: number,
  houseCount: HouseCount,
  isAdjustedArea: boolean,
  areaOver85: boolean
): AcquisitionTaxResult {
  let rate: number;
  if (houseCount === 1) {
    rate = baseAcquisitionRate(price);
  } else if (houseCount === 2) {
    rate = isAdjustedArea ? 0.08 : baseAcquisitionRate(price);
  } else {
    rate = isAdjustedArea ? 0.12 : 0.08;
  }

  const isHeavyRate = rate >= 0.08; // 다주택 중과세율(8%, 12%) 구간
  const localEduTaxRate = isHeavyRate ? 0.004 : rate * 0.1; // 중과 구간은 0.4% 고정 근사, 그 외는 취득세율의 10%
  const ruralTaxRate = areaOver85 ? 0.002 : 0;

  const tax = Math.round(price * rate);
  const localEduTax = Math.round(price * localEduTaxRate);
  const ruralTax = Math.round(price * ruralTaxRate);

  return {
    rate,
    tax,
    localEduTaxRate,
    localEduTax,
    ruralTaxRate,
    ruralTax,
    totalTax: tax + localEduTax + ruralTax,
  };
}

// 법무사 등기 수수료 추정치: 기본보수 30만원 + 가격에 비례한 누진료(최대 +30만원, 총 30~60만원 범위)
export function estimateLegalFee(price: number): number {
  const base = 300_000;
  const extra = Math.min(300_000, Math.round((price / 100_000_000) * 50_000));
  return base + extra;
}

export interface SaleMovingCostInput {
  price: number;
  brokerageFee: number; // 3.1 복비 계산기 결과(부가세 포함 금액)를 그대로 받아옴
  houseCount: HouseCount;
  isAdjustedArea: boolean;
  areaOver85: boolean;
  bondDiscount: number; // 국민주택채권 할인비용(사용자 직접 입력, 당일 시세 연동 불가)
}

export interface MovingCostLine {
  label: string;
  amount: number;
}

export interface SaleMovingCostResult {
  acquisition: AcquisitionTaxResult;
  legalFee: number;
  lines: MovingCostLine[];
  total: number;
}

export function calcSaleMovingCost(input: SaleMovingCostInput): SaleMovingCostResult {
  const { price, brokerageFee, houseCount, isAdjustedArea, areaOver85, bondDiscount } = input;
  const acquisition = calcAcquisitionTax(price, houseCount, isAdjustedArea, areaOver85);
  const legalFee = estimateLegalFee(price);

  const lines: MovingCostLine[] = [
    { label: "중개보수(부가세 포함)", amount: Math.round(brokerageFee) },
    { label: `취득세(${(acquisition.rate * 100).toFixed(2)}%)`, amount: acquisition.tax },
    { label: "지방교육세", amount: acquisition.localEduTax },
    ...(areaOver85 ? [{ label: "농어촌특별세", amount: acquisition.ruralTax }] : []),
    { label: "법무사 등기수수료(추정)", amount: legalFee },
    { label: "국민주택채권 할인비용", amount: Math.round(bondDiscount) },
  ];

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { acquisition, legalFee, lines, total };
}

export interface LeaseMovingCostInput {
  deposit: number;
  brokerageFee: number;
  guaranteeRatePercent: number; // HUG/HF 보증료율(%), 통상 0.115~0.154%
  periodMonths: number; // 임대차 기간(개월)
  useGuaranteeInsurance: boolean;
  movingFee: number;
  cleaningFee: number;
}

export interface LeaseMovingCostResult {
  guaranteeInsurance: number;
  lines: MovingCostLine[];
  total: number;
}

export function calcLeaseMovingCost(input: LeaseMovingCostInput): LeaseMovingCostResult {
  const { deposit, brokerageFee, guaranteeRatePercent, periodMonths, useGuaranteeInsurance, movingFee, cleaningFee } = input;

  const guaranteeInsurance = useGuaranteeInsurance
    ? Math.round(deposit * (guaranteeRatePercent / 100) * (periodMonths / 12))
    : 0;

  const lines: MovingCostLine[] = [
    { label: "중개보수(부가세 포함)", amount: Math.round(brokerageFee) },
    ...(useGuaranteeInsurance
      ? [{ label: `전세보증금반환보증료(${guaranteeRatePercent.toFixed(3)}%)`, amount: guaranteeInsurance }]
      : []),
    { label: "이사비(예상)", amount: Math.round(movingFee) },
    { label: "입주청소(예상)", amount: Math.round(cleaningFee) },
  ];

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { guaranteeInsurance, lines, total };
}
