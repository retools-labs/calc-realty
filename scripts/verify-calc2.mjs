// 3.2/3.4 계산기(이사 부대비용, 일할계산, 상가 Cap Rate) 회귀 테스트.
// 3.1은 verify-calc.mjs 참고. `npx tsx scripts/verify-calc2.mjs`로 실행.
import { calcProrate } from "../lib/prorate.ts";
import { calcCapRate, calcPremiumFee } from "../lib/capRate.ts";
import { calcAcquisitionTax, calcSaleMovingCost, calcLeaseMovingCost } from "../lib/movingCost.ts";

console.log("--- 3.3 일할계산: 8/15 입주, 월세 500,000, 관리비 100,000, 8월(31일), 장기수선충당금 제외 ---");
console.log(calcProrate({ moveInDate: "2026-08-15", monthlyRent: 500000, monthlyMaintenanceFee: 100000, longTermRepairFund: 10000, includeRepairFund: false }));

console.log("--- 3.4 Cap Rate: 매매가 5억, 보증금 5천만, 대출 2억, 이자율 4%, 월세 200만 ---");
console.log(calcCapRate({ purchasePrice: 500000000, deposit: 50000000, loanAmount: 200000000, loanRatePercent: 4, monthlyRent: 2000000 }));

console.log("--- 3.4 권리금 수수료: 권리금 5천만, 협의요율 7% ---");
console.log(calcPremiumFee(50000000, 7));

console.log("--- 3.2 취득세: 6억, 1주택, 비조정지역, 85㎡ 초과 ---");
console.log(calcAcquisitionTax(600000000, 1, false, true));

console.log("--- 3.2 매매 총부대비용: 6억, 복비 240만, 1주택, 85㎡ 초과, 채권할인 15만 ---");
console.log(calcSaleMovingCost({ price: 600000000, brokerageFee: 2400000, houseCount: 1, isAdjustedArea: false, areaOver85: true, bondDiscount: 150000 }));

console.log("--- 3.2 전월세 총부대비용: 보증금 2억, 복비 80만, 보증료율 0.128%, 24개월, 이사비 40만, 청소비 20만 ---");
console.log(calcLeaseMovingCost({ deposit: 200000000, brokerageFee: 800000, guaranteeRatePercent: 0.128, periodMonths: 24, useGuaranteeInsurance: true, movingFee: 400000, cleaningFee: 200000 }));
