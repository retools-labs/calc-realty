import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sitemap from "@/app/sitemap";
import { getRatesCanonical, OFFICIAL_RATES_URL } from "@/lib/aeo/canonical";
import {
  HOUSE_LEASE_RATE_ROWS,
  HOUSE_SALE_RATE_ROWS,
  MONTHLY_RENT_CONVERSION_TEXT,
  OTHER_PROPERTY_RATE_ROWS,
  RATES_GUIDANCE_TEXT,
  RATES_LOCAL_ORDINANCE_NOTICE,
  RATES_SUMMARY_TEXT,
  getRatesStructuredDataJson,
} from "@/lib/aeo/rates";
import { RATE_TABLE_BASIS_DATE } from "@/lib/aeo/structuredData";
import {
  calcBrokerageFee,
  convertMonthlyRentToDealAmount,
  formatKRW,
  HOUSE_LEASE_BRACKETS,
  HOUSE_SALE_BRACKETS,
  type RateBracket,
} from "@/lib/calc";

function assertHouseRowsMatchEngine(rows: typeof HOUSE_SALE_RATE_ROWS, brackets: RateBracket[], dealType: "sale" | "lease") {
  assert.equal(rows.length, brackets.length);

  rows.forEach((row, index) => {
    const bracket = brackets[index];
    const result = calcBrokerageFee({ propertyType: "house", dealType, price: bracket.min, vatType: "exempt" });

    assert.equal(row.label, bracket.label);
    assert.equal(row.capRate, bracket.rate);
    assert.equal(row.rateLabel, `${(bracket.rate * 100).toFixed(1)}%`);
    assert.equal(row.cap, bracket.cap);
    assert.equal(row.capLabel, bracket.cap === null ? "한도 없음" : formatKRW(bracket.cap));
    assert.equal(result.capRate, row.capRate);
    assert.equal(result.cap, row.cap);
  });
}

test("주택 매매·임대차 표는 계산 엔진의 구간·요율·한도와 일치한다", () => {
  assertHouseRowsMatchEngine(HOUSE_SALE_RATE_ROWS, HOUSE_SALE_BRACKETS, "sale");
  assertHouseRowsMatchEngine(HOUSE_LEASE_RATE_ROWS, HOUSE_LEASE_BRACKETS, "lease");
});

test("오피스텔·주택 외 표는 계산 엔진의 상한요율을 사용한다", () => {
  assert.equal(OTHER_PROPERTY_RATE_ROWS.length, 4);

  for (const row of OTHER_PROPERTY_RATE_ROWS) {
    const result = calcBrokerageFee({
      propertyType: row.propertyType,
      dealType: row.dealType,
      price: 100_000_000,
      vatType: "exempt",
    });

    assert.equal(row.bracketLabel, result.bracketLabel);
    assert.equal(row.capRate, result.capRate);
    assert.equal(row.rateLabel, `${(result.capRate * 100).toFixed(1)}%`);
  }
});

test("③ 매매·임대차 표 행은 매매와 임대차의 상한요율이 같다", () => {
  const rows = OTHER_PROPERTY_RATE_ROWS.filter((row) => row.dealTypeLabel === "매매·임대차");

  assert.equal(rows.length, 2);

  for (const row of rows) {
    const sale = calcBrokerageFee({ propertyType: row.propertyType, dealType: "sale", price: 100_000_000, vatType: "exempt" });
    const lease = calcBrokerageFee({ propertyType: row.propertyType, dealType: "lease", price: 100_000_000, vatType: "exempt" });

    assert.equal(sale.capRate, lease.capRate);
    assert.equal(sale.capRate, row.capRate);
    assert.equal(lease.capRate, row.capRate);
  }
});

test("월세 환산 문구는 계산 엔진의 두 분기와 일치한다", () => {
  assert.equal(convertMonthlyRentToDealAmount(10_000_000, 300_000), 31_000_000);
  assert.equal(convertMonthlyRentToDealAmount(50_000_000, 500_000), 100_000_000);
  assert.match(MONTHLY_RENT_CONVERSION_TEXT, /월세×100/);
  assert.match(MONTHLY_RENT_CONVERSION_TEXT, /5천만 원 미만/);
  assert.match(MONTHLY_RENT_CONVERSION_TEXT, /월세×70/);
});

test("요율표 문구는 기준일 외의 날짜와 새 법조문 번호를 넣지 않는다", () => {
  const pageText = [RATES_SUMMARY_TEXT, RATES_GUIDANCE_TEXT, RATES_LOCAL_ORDINANCE_NOTICE].join(" ");
  const withoutBasisDate = pageText.replace("2026년 11월 27일", "");
  const articleNumbers = pageText.match(/제\d+조/g) ?? [];

  assert.match(pageText, new RegExp(RATE_TABLE_BASIS_DATE.slice(0, 4)));
  assert.doesNotMatch(withoutBasisDate, /20\d{2}[-년]/);
  assert.deepEqual(articleNumbers, ["제20조"]);
});

test("요율표 JSON-LD는 정식 WebPage 주소와 기준일을 사용한다", () => {
  const jsonLd = JSON.parse(getRatesStructuredDataJson()) as Record<string, unknown>;

  assert.equal(jsonLd["@type"], "WebPage");
  assert.equal(jsonLd.dateModified, RATE_TABLE_BASIS_DATE);
  assert.equal(jsonLd.url, OFFICIAL_RATES_URL);
});

test("요율표 canonical은 정식 배포와 루트 배포를 구분한다", () => {
  assert.equal(
    getRatesCanonical({ siteUrl: "https://retools.kr/tool/realty", basePath: "/tool/realty", aeoEnabled: true }),
    OFFICIAL_RATES_URL,
  );
  assert.equal(getRatesCanonical({ siteUrl: undefined, basePath: undefined, aeoEnabled: true }), OFFICIAL_RATES_URL);
  assert.equal(getRatesCanonical({ siteUrl: undefined, basePath: "/calc", aeoEnabled: true }), undefined);
  assert.equal(getRatesCanonical({ siteUrl: undefined, basePath: undefined, aeoEnabled: false }), undefined);
});

test("사이트맵은 정식 사이트의 AEO on일 때만 요율표를 포함한다", () => {
  const previousSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const previousFlag = process.env.NEXT_PUBLIC_AEO_V1;

  try {
    process.env.NEXT_PUBLIC_SITE_URL = "https://retools.kr/tool/realty";
    process.env.NEXT_PUBLIC_AEO_V1 = "on";
    const enabled = sitemap();
    assert.ok(enabled.some((entry) => entry.url === OFFICIAL_RATES_URL));

    process.env.NEXT_PUBLIC_AEO_V1 = "off";
    assert.ok(!sitemap().some((entry) => entry.url === OFFICIAL_RATES_URL));

    delete process.env.NEXT_PUBLIC_SITE_URL;
    assert.deepEqual(sitemap(), []);
  } finally {
    if (previousSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousSiteUrl;
    if (previousFlag === undefined) delete process.env.NEXT_PUBLIC_AEO_V1;
    else process.env.NEXT_PUBLIC_AEO_V1 = previousFlag;
  }
});

test("계산기 링크는 AEO 스위치 안에서만 요율표를 가리킨다", () => {
  const calculatorHome = readFileSync(new URL("../components/CalculatorHome.tsx", import.meta.url), "utf8");

  assert.match(
    calculatorHome,
    /\{isAeoV1Enabled\(\) && \(\s*<p[\s\S]*?href=\{`\$\{BASE_PATH\}\/rates`\}/,
  );
});
