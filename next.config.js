/** @type {import('next').NextConfig} */
// realtybook.retools.kr/calc 서브패스 전용 배포에서만 NEXT_PUBLIC_BASE_PATH=/calc 환경변수를
// 설정한다. 기존 calc-realty.vercel.app(루트, TWA 앱 연결)은 이 값이 없어 그대로 루트로 동작.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  basePath,
};

module.exports = nextConfig;
