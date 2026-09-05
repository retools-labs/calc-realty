import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import Footer from "@/components/Footer";
import ChannelTalk from "@/components/ChannelTalk";
import Analytics from "@/components/Analytics";
import { PRODUCT_NAME_SHORT } from "@/lib/productName";

export const metadata: Metadata = {
  title: `${PRODUCT_NAME_SHORT} | 부동산 중개보수 계산기`,
  description:
    "매매·전세·월세 부동산 중개보수(복비)를 법정 상한요율 기준으로 바로 계산해보세요. 일반과세/간이과세 부가세까지 한번에.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "복비계산기",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d3b52",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* [지시 035 5-1-4] 글꼴을 불러오는 자리는 여기 한 곳입니다. 장부와 같은 판을 씁니다.
            next/font 를 쓰지 않는 이유: 장부는 CDN 링크로 같은 글꼴을 불러오고 있고,
            두 제품이 서로 다른 방식으로 같은 글꼴을 받으면 판올림 때 한쪽만 남습니다. */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink">
        {children}
        <Footer />
        <InstallPrompt />
        <ChannelTalk />
        <Analytics />
      </body>
    </html>
  );
}
