import type { Metadata } from "next";
import CalculatorHome from "@/components/CalculatorHome";
import AeoStructuredData from "@/components/aeo/AeoStructuredData";
import { getCalculatorCanonical } from "@/lib/aeo/canonical";
import { CALCULATOR_TITLE } from "@/lib/aeo/metadata";

const canonical = getCalculatorCanonical({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
});

export const metadata: Metadata = {
  ...(canonical ? { alternates: { canonical } } : {}),
  openGraph: { title: CALCULATOR_TITLE },
};

export default function Page() {
  return (
    <>
      <AeoStructuredData />
      <CalculatorHome />
    </>
  );
}
