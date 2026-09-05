"use client";

import { useMemo, useRef, useState } from "react";
import { calcBrokerageFee, formatKRW } from "@/lib/calc";
import { calcLeaseMovingCost, calcSaleMovingCost, type HouseCount } from "@/lib/movingCost";
import { SegButton, WonInput } from "./ui";
import ReceiptCard from "./ReceiptCard";
import ShareReceiptButton from "./ShareReceiptButton";
import { PRODUCT_NAME_SHORT } from "@/lib/productName";
import Modal from "./Modal";
import { ResultCard, ResultDivider, ResultHeadline, ResultRow } from "./ResultCard";

type DealKind = "sale" | "lease";

export default function MovingCostCalculator() {
  const [dealKind, setDealKind] = useState<DealKind>("sale");
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // 매매
  const [price, setPrice] = useState(0);
  const [houseCount, setHouseCount] = useState<HouseCount>(1);
  const [isAdjustedArea, setIsAdjustedArea] = useState(false);
  const [areaOver85, setAreaOver85] = useState(false);
  const [bondDiscount, setBondDiscount] = useState(0);

  // 전월세
  const [deposit, setDeposit] = useState(0);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [periodMonths, setPeriodMonths] = useState(24);
  const [useGuaranteeInsurance, setUseGuaranteeInsurance] = useState(true);
  const [guaranteeRatePercent, setGuaranteeRatePercent] = useState(0.128);
  const [movingFee, setMovingFee] = useState(800_000);
  const [cleaningFee, setCleaningFee] = useState(150_000);
  const receiptRef = useRef<HTMLDivElement>(null);

  const saleBrokerage = useMemo(
    () =>
      calcBrokerageFee({
        propertyType: "house",
        dealType: "sale",
        price,
        vatType: "general",
      }),
    [price]
  );

  const leaseBrokerage = useMemo(
    () =>
      calcBrokerageFee({
        propertyType: "house",
        dealType: "lease",
        price: deposit,
        deposit,
        monthlyRent: monthlyRent > 0 ? monthlyRent : undefined,
        vatType: "general",
      }),
    [deposit, monthlyRent]
  );

  const saleResult = useMemo(
    () =>
      calcSaleMovingCost({
        price,
        brokerageFee: saleBrokerage.totalWithVat,
        houseCount,
        isAdjustedArea,
        areaOver85,
        bondDiscount,
      }),
    [price, saleBrokerage, houseCount, isAdjustedArea, areaOver85, bondDiscount]
  );

  const leaseResult = useMemo(
    () =>
      calcLeaseMovingCost({
        deposit,
        brokerageFee: leaseBrokerage.totalWithVat,
        guaranteeRatePercent,
        periodMonths,
        useGuaranteeInsurance,
        movingFee,
        cleaningFee,
      }),
    [deposit, leaseBrokerage, guaranteeRatePercent, periodMonths, useGuaranteeInsurance, movingFee, cleaningFee]
  );

  const lines = dealKind === "sale" ? saleResult.lines : leaseResult.lines;
  const total = dealKind === "sale" ? saleResult.total : leaseResult.total;

  const receiptSubtitle = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`;
    const dealLabel = dealKind === "sale" ? "매매(내 집 마련)" : "전월세(이사)";
    const amount = dealKind === "sale" ? price : deposit;
    return `${dealLabel} · ${formatKRW(amount)} · ${ym} 기준`;
  }, [dealKind, price, deposit]);

  const shareText = useMemo(() => {
    const header = dealKind === "sale" ? "[부동산 취득 총 필요자금 영수증]" : "[전월세 입주 총 필요자금 영수증]";
    const body = lines.map((l) => `${l.label}: ${formatKRW(l.amount)}`);
    return [header, ...body, `합계: ${formatKRW(total)}`].join("\n");
  }, [dealKind, lines, total]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold">이사 총 부대비용 계산기</h1>
      <p className="mt-1 text-sm text-[#8B95A1]">
        중개보수 외에 실제로 준비해야 하는 부대비용까지 한 번에 계산해드립니다.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <span className="mb-2 block text-sm font-medium text-[#4E5968]">거래 유형</span>
          <SegButton
            value={dealKind}
            onChange={setDealKind}
            options={[
              { value: "sale", label: "매매(내 집 마련)" },
              { value: "lease", label: "전월세(이사)" },
            ]}
          />
        </div>

        {dealKind === "sale" ? (
          <>
            <WonInput label="매매가" value={price} onChange={setPrice} placeholder="예: 500,000,000" />

            <div>
              <span className="mb-2 block text-sm font-medium text-[#4E5968]">보유 주택 수(이번 계약 포함)</span>
              <SegButton
                value={String(houseCount)}
                onChange={(v) => setHouseCount(Number(v) as HouseCount)}
                options={[
                  { value: "1", label: "1주택" },
                  { value: "2", label: "2주택" },
                  { value: "3", label: "3주택 이상" },
                ]}
              />
            </div>

            {houseCount >= 2 && (
              <label className="flex items-center justify-between rounded-xl border border-[#E5E8EB] p-4">
                <span className="text-sm font-semibold">조정대상지역 여부</span>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={isAdjustedArea}
                  onChange={(e) => setIsAdjustedArea(e.target.checked)}
                />
              </label>
            )}

            <label className="flex items-center justify-between rounded-xl border border-[#E5E8EB] p-4">
              <span className="text-sm font-semibold">전용면적 85㎡ 초과</span>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={areaOver85}
                onChange={(e) => setAreaOver85(e.target.checked)}
              />
            </label>

            <WonInput
              label="국민주택채권 할인비용"
              value={bondDiscount}
              onChange={setBondDiscount}
              placeholder="법무사 안내금액 입력(당일 시세 연동 불가)"
            />
          </>
        ) : (
          <>
            <WonInput label="보증금" value={deposit} onChange={setDeposit} placeholder="예: 300,000,000" />
            <WonInput label="월세(전세면 0)" value={monthlyRent} onChange={setMonthlyRent} />

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#4E5968]">임대차 기간(개월)</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 text-lg font-semibold outline-none focus:border-cobalt"
                value={periodMonths}
                onChange={(e) => setPeriodMonths(Math.max(1, Number(e.target.value) || 0))}
              />
            </label>

            <div className="rounded-xl border border-[#E5E8EB] p-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-semibold">전세보증금 반환보증(HUG/HF) 가입</span>
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={useGuaranteeInsurance}
                  onChange={(e) => setUseGuaranteeInsurance(e.target.checked)}
                />
              </label>
              {useGuaranteeInsurance && (
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-sm text-[#4E5968]">
                    <span>보증료율</span>
                    <span className="font-semibold text-cobalt">{guaranteeRatePercent.toFixed(3)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.115}
                    max={0.154}
                    step={0.001}
                    value={guaranteeRatePercent}
                    onChange={(e) => setGuaranteeRatePercent(Number(e.target.value))}
                    className="w-full accent-cobalt"
                  />
                  <p className="mt-1 text-xs text-[#8B95A1]">
                    * 실제 요율은 보증기관·신용도·주택유형에 따라 0.115~0.154% 범위에서 달라져요.
                  </p>
                </div>
              )}
            </div>

            <WonInput label="이사비(예상)" value={movingFee} onChange={setMovingFee} />
            <WonInput label="입주청소(예상)" value={cleaningFee} onChange={setCleaningFee} />
          </>
        )}
      </div>

      <div className="mt-5">
        <ResultCard>
          <ResultHeadline
            label={dealKind === "sale" ? "부동산 취득 총 필요자금" : "전월세 입주 총 필요자금"}
            value={formatKRW(total).replace("원", "")}
            suffix="원"
            subtitle={receiptSubtitle}
          />
          <ResultDivider />
          {lines.map((l) => (
            <ResultRow key={l.label} label={l.label} value={formatKRW(l.amount)} />
          ))}
        </ResultCard>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-xl bg-cobalt py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
        >
          {copied ? "복사됐어요 ✓" : "결과 텍스트로 복사하기"}
        </button>
        <button
          type="button"
          onClick={() => setShowReceipt(true)}
          className="w-full rounded-xl border border-cobalt py-3 text-sm font-semibold text-cobalt transition active:scale-[0.99]"
        >
          영수증 카드 보기
        </button>
      </div>

      <Modal open={showReceipt} onClose={() => setShowReceipt(false)}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-[#16232E]">영수증 카드 미리보기</span>
          <button
            type="button"
            onClick={() => setShowReceipt(false)}
            className="text-2xl leading-none text-[#8B95A1]"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <ReceiptCard
          ref={receiptRef}
          title={dealKind === "sale" ? "부동산 취득 총 필요자금 영수증" : "전월세 입주 총 필요자금 영수증"}
          subtitle={receiptSubtitle}
          lines={lines}
          total={total}
        />
        <ShareReceiptButton targetRef={receiptRef} fileName={`${PRODUCT_NAME_SHORT}_이사비용_영수증.png`} />
      </Modal>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#9AA5B1]">
        취득세는 다주택·조정대상지역 여부에 따라 세율이 자주 바뀌고, 법무사수수료·국민주택채권
        할인비용도 지역·시점마다 차이가 있어 이 계산 결과는 전부 참고용 추정치입니다. 실제 납부·지급
        금액은 법무사·세무사와 반드시 확인하세요.
      </p>
    </div>
  );
}
