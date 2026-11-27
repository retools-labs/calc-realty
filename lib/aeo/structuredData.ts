import { OFFICIAL_CALCULATOR_URL } from "@/lib/aeo/canonical";
import { AEO_FAQS } from "@/lib/aeo/faq";
import { CALC_PRODUCT_NAME } from "@/lib/productName";

// calc.ts에 요율표의 기준일이 없어, AEO FAQ를 실제 갱신한 날짜를 임시 기준일로 둡니다.
export const RATE_TABLE_BASIS_DATE = "2026-11-27";

export function getAeoStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: CALC_PRODUCT_NAME,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web, Android",
      url: OFFICIAL_CALCULATOR_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      dateModified: RATE_TABLE_BASIS_DATE,
      publisher: {
        "@type": "Organization",
        "@id": "https://retools.kr/#org",
        name: "리툴스",
        url: "https://retools.kr/",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: AEO_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
