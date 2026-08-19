// 평수·평단가 계산 엔진
// 근거: 1평 = 400/121 ㎡ ≒ 3.305785㎡ (부동산 실무에서 관용적으로 쓰는 정확한 환산값).
// 순수 산술 변환만 다루는 계산기라 법정 요율 같은 규제 리스크는 없다.

export const PYEONG_TO_SQM = 400 / 121; // ≒ 3.3057851...

export type AreaUnit = "pyeong" | "sqm";

export interface PyeongInput {
  totalAmount: number; // 총 금액(매매가/보증금 등)
  areaValue: number; // 입력한 면적 값
  areaUnit: AreaUnit; // 입력한 면적의 단위
}

export interface PyeongResult {
  pyeong: number; // 평 환산
  sqm: number; // ㎡ 환산
  pricePerPyeong: number; // 평당가
  pricePerSqm: number; // ㎡당가
}

export function sqmToPyeong(sqm: number): number {
  return sqm / PYEONG_TO_SQM;
}

export function pyeongToSqm(pyeong: number): number {
  return pyeong * PYEONG_TO_SQM;
}

export function calcPyeong(input: PyeongInput): PyeongResult | null {
  const { totalAmount, areaValue, areaUnit } = input;
  if (!areaValue || areaValue <= 0) return null;

  const pyeong = areaUnit === "pyeong" ? areaValue : sqmToPyeong(areaValue);
  const sqm = areaUnit === "sqm" ? areaValue : pyeongToSqm(areaValue);

  const pricePerPyeong = pyeong > 0 ? Math.round(totalAmount / pyeong) : 0;
  const pricePerSqm = sqm > 0 ? Math.round(totalAmount / sqm) : 0;

  return { pyeong, sqm, pricePerPyeong, pricePerSqm };
}
