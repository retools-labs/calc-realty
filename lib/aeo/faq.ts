import {
  VAT_RATES,
  calcBrokerageFee,
  convertMonthlyRentToDealAmount,
  formatKRW,
} from "@/lib/calc";

export type AeoFaqEntry = {
  question: string;
  answer: string;
};

const saleFiveHundredMillion = calcBrokerageFee({
  propertyType: "house",
  dealType: "sale",
  price: 500_000_000,
  vatType: "exempt",
});

const leaseThreeHundredMillion = calcBrokerageFee({
  propertyType: "house",
  dealType: "lease",
  price: 300_000_000,
  vatType: "exempt",
});

const monthlyRentExample = calcBrokerageFee({
  propertyType: "house",
  dealType: "lease",
  price: 0,
  deposit: 10_000_000,
  monthlyRent: 500_000,
  vatType: "exempt",
});

const monthlyRentExampleDealAmount = convertMonthlyRentToDealAmount(10_000_000, 500_000);

export const AEO_FAQS: AeoFaqEntry[] = [
  {
    question: "매매 5억 복비 상한은?",
    answer: `주택 매매가 ${formatKRW(saleFiveHundredMillion.dealAmount)}의 중개보수 상한은 ${formatKRW(saleFiveHundredMillion.capFee)}입니다. 이 계산기는 상한요율 ${(saleFiveHundredMillion.capRate * 100).toFixed(1)}%를 적용하며, 실제 보수는 이 범위 안에서 개업공인중개사와 협의해 정합니다.`,
  },
  {
    question: "전세 3억 복비는?",
    answer: `주택 전세보증금 ${formatKRW(leaseThreeHundredMillion.dealAmount)}의 중개보수 상한은 ${formatKRW(leaseThreeHundredMillion.capFee)}입니다. 이 계산기는 상한요율 ${(leaseThreeHundredMillion.capRate * 100).toFixed(1)}%를 적용하며, 실제 보수는 이 범위 안에서 개업공인중개사와 협의해 정합니다.`,
  },
  {
    question: "월세 복비는 어떻게 계산하나요?",
    answer: `월세는 보증금에 월세의 100배를 더한 환산금액을 기준으로 구간표를 적용합니다. 환산금액이 5천만원 미만이면 월세의 70배를 더합니다. 예를 들어 보증금 1천만원과 월세 50만원은 ${formatKRW(monthlyRentExampleDealAmount)}으로 환산되고, 이 계산기의 주택 임대차 상한 보수는 ${formatKRW(monthlyRentExample.capFee)}입니다.`,
  },
  {
    question: "부가세는 따로인가요?",
    answer: `이 계산기는 일반과세를 중개보수의 ${(VAT_RATES.general * 100).toFixed(0)}%로 계산해 표시합니다. 간이과세는 업종별 부가가치율을 반영한 세액이 달라 정해진 부가세율이 없어서, 참고용으로 중개보수의 ${(VAT_RATES.simplified * 100).toFixed(0)}% 정도로 근사해 보여 줍니다. 면세·생략을 고르면 부가세를 더하지 않습니다. 실제 부가세 부담은 중개사무소의 과세 유형과 신고 방식, 약정에 따라 달라지므로 거래 전에 중개사무소에 확인하세요.`,
  },
  {
    question: "지역마다 다른가요?",
    answer: "이 계산기는 서울특별시 조례 기준 요율표를 기본으로 사용합니다. 중개보수 상한요율은 법정 기준과 시·도 조례에 따라 정해지므로, 일부 지역은 조례가 다를 수 있어 정확한 금액은 거래 지역의 관할 시·도 조례를 확인하세요.",
  },
];
