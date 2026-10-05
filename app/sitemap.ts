import type { MetadataRoute } from "next";

/**
 * [10/5] 정식 주소(retools.kr/tool/realty) 배포에서만 주소를 낸다. 포털 사이트맵 색인이 이 파일을 가리킨다.
 * 앱(TWA) 루트 배포는 NEXT_PUBLIC_SITE_URL 이 없어 빈 사이트맵이다(검색 등록 대상이 아니다).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!site) return [];
  const lastModified = new Date("2026-10-05");
  return [
    { url: `${site}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
