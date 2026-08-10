import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "복비 계산기 | 부동산 중개보수 계산기",
  description:
    "매매·전세·월세 부동산 중개보수(복비)를 법정 상한요율 기준으로 바로 계산해보세요. 일반과세/간이과세 부가세까지 한번에.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-toss-bg text-[#191F28]">{children}</body>
    </html>
  );
}
