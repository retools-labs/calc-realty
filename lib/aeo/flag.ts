export function isAeoV1Enabled(value = process.env.NEXT_PUBLIC_AEO_V1): boolean {
  return value !== "off";
}
