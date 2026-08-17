import { calcBrokerageFee, formatKRW } from '../lib/calc.ts';

const cases = [
  {
    name: '주택 매매 5억, 일반과세, 상한요율',
    input: { propertyType: 'house', dealType: 'sale', price: 500_000_000, vatType: 'general' },
    expectFeeExRate: 0.004,
  },
  {
    name: '주택 매매 4천만원 (한도액 적용 구간)',
    input: { propertyType: 'house', dealType: 'sale', price: 40_000_000, vatType: 'general' },
    expectCapHit: 250000,
  },
  {
    name: '주택 전세 8천만원',
    input: { propertyType: 'house', dealType: 'lease', price: 80_000_000, deposit: 80_000_000, vatType: 'exempt' },
  },
  {
    name: '주택 월세 보증금1천/월세50 (환산: 1000만+50만*100=6000만 -> 5천만 이상이므로 x100 적용)',
    input: { propertyType: 'house', dealType: 'lease', price: 0, deposit: 10_000_000, monthlyRent: 500_000, vatType: 'general' },
  },
  {
    name: '주택 월세 보증금500/월세20 (환산: 500만+20만*100=2500만 -> 5천만 미만이므로 x70 적용: 500만+20만*70=1900만)',
    input: { propertyType: 'house', dealType: 'lease', price: 0, deposit: 5_000_000, monthlyRent: 200_000, vatType: 'general' },
  },
  {
    name: '오피스텔(85㎡ 이하) 매매 2억',
    input: { propertyType: 'officetelSmall', dealType: 'sale', price: 200_000_000, vatType: 'general' },
  },
  {
    name: '토지·상가 매매 3억, 협의요율 0.5% (상한 0.9%보다 낮음)',
    input: { propertyType: 'other', dealType: 'sale', price: 300_000_000, vatType: 'general', negotiatedRate: 0.5 },
  },
  {
    name: '토지·상가 매매 3억, 협의요율 1.5% 입력 (상한 초과 -> 상한 0.9%로 캡)',
    input: { propertyType: 'other', dealType: 'sale', price: 300_000_000, vatType: 'general', negotiatedRate: 1.5 },
  },
];

for (const c of cases) {
  const r = calcBrokerageFee(c.input);
  console.log('---', c.name);
  console.log('  거래금액(환산):', formatKRW(r.dealAmount));
  console.log('  구간:', r.bracketLabel, '상한요율:', (r.capRate*100).toFixed(2)+'%', '한도:', r.cap ? formatKRW(r.cap) : '없음');
  console.log('  상한요율 적용 보수:', formatKRW(r.capFee));
  console.log('  실제 적용요율:', (r.appliedRate*100).toFixed(3)+'%', '적용 보수:', formatKRW(r.appliedFee));
  console.log('  부가세:', formatKRW(r.vat), '/ 총액:', formatKRW(r.totalWithVat));
}
