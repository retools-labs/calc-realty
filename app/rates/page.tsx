import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BASE_PATH } from "@/lib/basePath";
import { getRatesCanonical } from "@/lib/aeo/canonical";
import { isAeoV1Enabled } from "@/lib/aeo/flag";
import {
  HOUSE_LEASE_RATE_ROWS,
  HOUSE_SALE_RATE_ROWS,
  MONTHLY_RENT_CONVERSION_TEXT,
  OTHER_PROPERTY_RATE_ROWS,
  RATES_GUIDANCE_TEXT,
  RATES_LOCAL_ORDINANCE_NOTICE,
  RATES_SUMMARY_TEXT,
  RATE_TABLE_SOURCES,
  getRatesStructuredDataJson,
} from "@/lib/aeo/rates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const canonical = getRatesCanonical({ siteUrl: SITE_URL, basePath: BASE_PATH });
const title = "부동산 중개보수(복비) 상한요율표 | 서울특별시 조례 기준";

export const metadata: Metadata = {
  title,
  description: "서울특별시 조례 기준으로 부동산 중개보수의 거래금액 구간, 상한요율, 한도액을 정리한 표입니다.",
  alternates: { canonical },
  openGraph: { title, url: canonical },
};

function HouseRateTable({
  caption,
  rows,
}: {
  caption: string;
  rows: typeof HOUSE_SALE_RATE_ROWS;
}) {
  return (
    <table className="w-full table-fixed border-collapse text-left text-[11px] leading-5 text-[#333D4B] sm:text-xs">
      <caption className="mb-2 text-left text-sm font-semibold text-[#16232E]">{caption}</caption>
      <thead className="border-y border-[#DCE3E9] text-[#16232E]">
        <tr>
          <th scope="col" className="w-[52%] py-2 pr-2 font-semibold">거래금액</th>
          <th scope="col" className="w-[18%] py-2 pr-2 font-semibold">상한요율</th>
          <th scope="col" className="w-[30%] py-2 font-semibold">한도액</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-[#E8EDF1] align-top">
            <td className="py-2 pr-2 break-keep">{row.label}</td>
            <td className="py-2 pr-2">{row.rateLabel}</td>
            <td className="py-2 break-keep">{row.capLabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OtherPropertyRateTable() {
  return (
    <table className="w-full table-fixed border-collapse text-left text-[11px] leading-5 text-[#333D4B] sm:text-xs">
      <caption className="mb-2 text-left text-sm font-semibold text-[#16232E]">오피스텔·주택 외</caption>
      <thead className="border-y border-[#DCE3E9] text-[#16232E]">
        <tr>
          <th scope="col" className="w-[54%] py-2 pr-2 font-semibold">대상</th>
          <th scope="col" className="w-[24%] py-2 pr-2 font-semibold">거래</th>
          <th scope="col" className="w-[22%] py-2 font-semibold">상한요율</th>
        </tr>
      </thead>
      <tbody>
        {OTHER_PROPERTY_RATE_ROWS.map((row) => (
          <tr key={`${row.bracketLabel}-${row.dealTypeLabel}`} className="border-b border-[#E8EDF1] align-top">
            <td className="py-2 pr-2 break-keep">{row.bracketLabel}</td>
            <td className="py-2 pr-2 break-keep">{row.dealTypeLabel}</td>
            <td className="py-2">{row.rateLabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function RatesPage() {
  if (!isAeoV1Enabled()) notFound();

  return (
    <main className="min-h-screen bg-[#F2F6FA] pb-10 text-[#16232E]">
      <article className="mx-auto max-w-md px-4 pb-4 pt-8 text-sm leading-7 text-[#333D4B]">
        <h1 className="text-2xl font-bold tracking-tight text-[#16232E]">부동산 중개보수(복비) 상한요율표</h1>
        <p className="mt-3 text-sm leading-6 text-[#4E5968]">{RATES_SUMMARY_TEXT}</p>

        <section className="mt-8" aria-labelledby="house-sale-heading">
          <h2 id="house-sale-heading" className="sr-only">주택 매매·교환</h2>
          <HouseRateTable caption="주택 매매·교환" rows={HOUSE_SALE_RATE_ROWS} />
        </section>

        <section className="mt-8" aria-labelledby="house-lease-heading">
          <h2 id="house-lease-heading" className="sr-only">주택 임대차 등</h2>
          <HouseRateTable caption="주택 임대차 등(전세·월세)" rows={HOUSE_LEASE_RATE_ROWS} />
        </section>

        <section className="mt-8" aria-labelledby="other-property-heading">
          <h2 id="other-property-heading" className="sr-only">오피스텔·주택 외</h2>
          <OtherPropertyRateTable />
        </section>

        <section className="mt-8" aria-labelledby="monthly-rent-heading">
          <h2 id="monthly-rent-heading" className="text-lg font-bold text-[#16232E]">월세 환산</h2>
          <p className="mt-3">{MONTHLY_RENT_CONVERSION_TEXT}</p>
        </section>

        <section className="mt-8" aria-labelledby="guidance-heading">
          <h2 id="guidance-heading" className="text-lg font-bold text-[#16232E]">확인할 점</h2>
          <p className="mt-3">{RATES_GUIDANCE_TEXT}</p>
          <p className="mt-3">{RATES_LOCAL_ORDINANCE_NOTICE}</p>
        </section>

        <p className="mt-8">
          <a href={`${BASE_PATH}/`} className="font-semibold text-[#333D4B] underline underline-offset-2">계산기로 돌아가기</a>
        </p>

        <section className="mt-8" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-lg font-bold text-[#16232E]">출처</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {RATE_TABLE_SOURCES.map((source) => <li key={source}>{source}</li>)}
          </ul>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getRatesStructuredDataJson() }} />
    </main>
  );
}
