import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_KR, Sora } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import Footer from "@/components/Footer";
import ChannelTalk from "@/components/ChannelTalk";
import Analytics from "@/components/Analytics";

// design-preview: 마스터플랜 4장 타이포그래피 스펙(영문/숫자 Sora, 국문 IBM Plex Sans KR).
const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-sora" });
const plexKr = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-kr",
});

export const metadata: Metadata = {
  title: "리얼티북 | 부동산 중개보수 계산기",
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
    <html lang="ko" className={`${sora.variable} ${plexKr.variable}`}>
      <body className="min-h-screen bg-toss-bg text-[#191F28] font-plexkr">
        {children}
        <Footer />
        <InstallPrompt />
        <ChannelTalk />
        <Analytics />
      </body>
    </html>
  );
}
