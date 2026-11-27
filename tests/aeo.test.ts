import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { GET as getRobots } from "@/app/robots.txt/route";
import { getCalculatorCanonical, OFFICIAL_CALCULATOR_URL } from "@/lib/aeo/canonical";
import { AEO_FAQS } from "@/lib/aeo/faq";
import { isAeoV1Enabled } from "@/lib/aeo/flag";
import { CALCULATOR_TITLE } from "@/lib/aeo/metadata";
import { getAeoStructuredData, serializeJsonLd } from "@/lib/aeo/structuredData";
import { calcBrokerageFee, formatKRW } from "@/lib/calc";

test("FAQ 금액은 계산 엔진 결과와 일치한다", () => {
  const sale = calcBrokerageFee({ propertyType: "house", dealType: "sale", price: 500_000_000, vatType: "exempt" });
  const lease = calcBrokerageFee({ propertyType: "house", dealType: "lease", price: 300_000_000, vatType: "exempt" });

  assert.match(AEO_FAQS[0].answer, new RegExp(formatKRW(sale.capFee)));
  assert.match(AEO_FAQS[1].answer, new RegExp(formatKRW(lease.capFee)));
});

test("JSON-LD는 두 스키마와 기준일을 갖는다", () => {
  const parsed = JSON.parse(serializeJsonLd(getAeoStructuredData())) as Array<Record<string, unknown>>;

  assert.deepEqual(parsed.map((data) => data["@type"]), ["WebApplication", "FAQPage"]);
  assert.equal((parsed[0].offers as Record<string, unknown>)["@type"], "Offer");
  assert.ok(parsed[0].dateModified);
  assert.match(serializeJsonLd({ value: "<" }), /\\u003c/);
});

test("루트 TWA 배포만 정식 주소를 canonical로 쓴다", () => {
  assert.equal(getCalculatorCanonical({ siteUrl: undefined, basePath: undefined, aeoEnabled: true }), OFFICIAL_CALCULATOR_URL);
  assert.equal(getCalculatorCanonical({ siteUrl: "https://retools.kr/tool/realty", basePath: undefined, aeoEnabled: true }), undefined);
  assert.equal(getCalculatorCanonical({ siteUrl: undefined, basePath: "/calc", aeoEnabled: true }), undefined);
});

test("AEO on일 때 robots는 Sitemap 없이 전체 경로를 허용한다", async () => {
  const previous = process.env.NEXT_PUBLIC_AEO_V1;
  process.env.NEXT_PUBLIC_AEO_V1 = "on";

  try {
    const result = getRobots();

    assert.equal(result.status, 200);
    assert.equal(result.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await result.text(), "User-agent: *\nAllow: /\n");
  } finally {
    process.env.NEXT_PUBLIC_AEO_V1 = previous;
  }
});

test("AEO off일 때 robots는 404를 반환한다", () => {
  const previous = process.env.NEXT_PUBLIC_AEO_V1;
  process.env.NEXT_PUBLIC_AEO_V1 = "off";

  try {
    assert.equal(getRobots().status, 404);
  } finally {
    process.env.NEXT_PUBLIC_AEO_V1 = previous;
  }
});

test("AEO 스위치는 off일 때만 꺼진다", () => {
  assert.equal(isAeoV1Enabled(), true);
  assert.equal(isAeoV1Enabled("off"), false);
  assert.equal(isAeoV1Enabled("false"), true);
  assert.equal(getCalculatorCanonical({ siteUrl: undefined, basePath: undefined, aeoEnabled: isAeoV1Enabled("off") }), undefined);
});

test("AEO on/off 모두 기존 FAQ를 유지하고, on일 때 금액 FAQ를 렌더한다", () => {
  const calculatorHome = readFileSync(new URL("../components/CalculatorHome.tsx", import.meta.url), "utf8");

  for (const question of [
    "상한요율은 반드시 내야 하는 요율인가요?",
    "협의로 더 깎을 수 있나요?",
    "오피스텔은 왜 주택과 다른가요?",
    "잔금일 일할계산이란 무엇인가요?",
    "지자체 조례가 다르면 어떻게 하나요?",
    "중개보수는 언제 내나요?",
  ]) {
    assert.ok(calculatorHome.includes(question));
  }

  assert.match(calculatorHome, /\{isAeoV1Enabled\(\) && <AeoFaq \/>\}/);
  assert.doesNotMatch(calculatorHome, /isAeoV1Enabled\(\)\s*\?/);
});

test("제목은 정본 제품명을 사용해 고정한다", () => {
  assert.equal(CALCULATOR_TITLE, "부동산 계산기 | 중개수수료(복비)·취득세·잔금 일할 계산");
});
