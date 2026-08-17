// 잔금일(입주일) 기준 월세·관리비 일할(日割) 계산 엔진
// 근거: 실무 관행상 일할계산 = 금액 ÷ 해당월 총일수 × 거주일수 (원단위 반올림).
// 계약 시작일(잔금일)이 월 중간이면 그 달은 입주일부터 말일까지만 거주하는 것으로 보고
// 며칠치만 청구하는 게 일반적 실무 방식이다.
// 장기수선충당금은 원칙적으로 임대인(소유자) 부담 항목이라 임차인에게 청구하지 않는 것이
// 원칙이지만, 관행적으로 관리비에 합산해 임차인에게 전가하는 경우도 있어 옵션으로 뺄 수 있게 함.

export interface ProrateInput {
  moveInDate: string; // "YYYY-MM-DD" — 잔금일/입주일
  monthlyRent: number; // 월세
  monthlyMaintenanceFee: number; // 관리비 (장기수선충당금 제외 금액)
  longTermRepairFund: number; // 장기수선충당금 월 부과액 (0이면 해당 없음)
  includeRepairFund: boolean; // 장기수선충당금을 일할 계산에 포함할지 여부
}

export interface ProrateResult {
  year: number;
  month: number; // 1~12
  daysInMonth: number;
  occupiedDays: number; // 입주일부터 말일까지 거주일수 (입주일 포함)
  moveInDay: number; // 입주일(일)
  proratedRent: number;
  proratedMaintenanceFee: number;
  proratedRepairFund: number; // includeRepairFund가 false면 0
  totalProrated: number;
  fullMonthTotal: number; // 한 달 전체 금액(월세+관리비+[장기수선충당금]) 참고용
}

function daysInMonth(year: number, month: number): number {
  // month: 1~12. new Date(year, month, 0) → 그 달의 마지막 날.
  return new Date(year, month, 0).getDate();
}

export function calcProrate(input: ProrateInput): ProrateResult | null {
  const { moveInDate, monthlyRent, monthlyMaintenanceFee, longTermRepairFund, includeRepairFund } = input;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(moveInDate);
  if (!m) return null;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const moveInDay = Number(m[3]);
  const total = daysInMonth(year, month);
  if (moveInDay < 1 || moveInDay > total) return null;

  const occupiedDays = total - moveInDay + 1;

  const perDay = (amount: number) => amount / total;
  const round = (n: number) => Math.round(n);

  const proratedRent = round(perDay(monthlyRent) * occupiedDays);
  const proratedMaintenanceFee = round(perDay(monthlyMaintenanceFee) * occupiedDays);
  const proratedRepairFund = includeRepairFund ? round(perDay(longTermRepairFund) * occupiedDays) : 0;

  const totalProrated = proratedRent + proratedMaintenanceFee + proratedRepairFund;
  const fullMonthTotal = monthlyRent + monthlyMaintenanceFee + (includeRepairFund ? longTermRepairFund : 0);

  return {
    year,
    month,
    daysInMonth: total,
    occupiedDays,
    moveInDay,
    proratedRent,
    proratedMaintenanceFee,
    proratedRepairFund,
    totalProrated,
    fullMonthTotal,
  };
}
