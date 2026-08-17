// 상가 임대수익률(Cap Rate) & 권리금 수수료 계산 엔진
//
// 임대수익률 = [(월세×12) − (대출이자×12)] / [매매가 − 보증금 − 대출금] × 100
// 권리금 수수료는 법정 상한이 없는 협의 수수료(통상 5~10%)이므로, 구간별 예상액만
// 참고용으로 보여준다.

export interface CapRateInput {
  purchasePrice: number; // 매매가
  deposit: number; // 임차인에게 받은 보증금
  loanAmount: number; // 대출금
  loanRatePercent: number; // 대출 연이자율(%)
  monthlyRent: number; // 월세
}

export interface CapRateResult {
  netInvestment: number; // 매매가 − 보증금 − 대출금 (실투자금)
  annualRentIncome: number; // 월세 × 12
  annualLoanInterest: number; // 대출금 × 연이자율
  netAnnualIncome: number; // 연간 순수익 = 임대수익 − 대출이자
  capRatePercent: number | null; // 실투자금이 0 이하면 계산 불가(null)
}

export function calcCapRate(input: CapRateInput): CapRateResult {
  const { purchasePrice, deposit, loanAmount, loanRatePercent, monthlyRent } = input;

  const netInvestment = purchasePrice - deposit - loanAmount;
  const annualRentIncome = monthlyRent * 12;
  const annualLoanInterest = Math.round(loanAmount * (loanRatePercent / 100));
  const netAnnualIncome = annualRentIncome - annualLoanInterest;
  const capRatePercent = netInvestment > 0 ? (netAnnualIncome / netInvestment) * 100 : null;

  return { netInvestment, annualRentIncome, annualLoanInterest, netAnnualIncome, capRatePercent };
}

export interface PremiumFeeResult {
  low: number; // 5% 구간 예상액
  mid: number; // 협의요율 예상액
  high: number; // 10% 구간 예상액
}

export function calcPremiumFee(premiumAmount: number, negotiatedRatePercent: number): PremiumFeeResult {
  return {
    low: Math.round(premiumAmount * 0.05),
    mid: Math.round(premiumAmount * (negotiatedRatePercent / 100)),
    high: Math.round(premiumAmount * 0.1),
  };
}
