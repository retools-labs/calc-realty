import { isAeoV1Enabled } from "@/lib/aeo/flag";

export const OFFICIAL_CALCULATOR_URL = "https://retools.kr/tool/realty";
export const OFFICIAL_RATES_URL = `${OFFICIAL_CALCULATOR_URL}/rates`;

export function getCalculatorCanonical({
  siteUrl,
  basePath,
  aeoEnabled = isAeoV1Enabled(),
}: {
  siteUrl?: string;
  basePath?: string;
  aeoEnabled?: boolean;
}): string | undefined {
  if (!aeoEnabled || siteUrl || basePath) return undefined;
  return OFFICIAL_CALCULATOR_URL;
}

export function getRatesCanonical({
  siteUrl,
  basePath,
  aeoEnabled = isAeoV1Enabled(),
}: {
  siteUrl?: string;
  basePath?: string;
  aeoEnabled?: boolean;
}): string | undefined {
  if (!aeoEnabled) return undefined;
  if (siteUrl) return `${siteUrl.replace(/\/$/, "")}/rates`;
  if (basePath) return undefined;
  return OFFICIAL_RATES_URL;
}
