/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        toss: {
          blue: "#3182F6",
          bg: "#F2F4F6",
        },
        // design-preview 브랜치: 마스터플랜 4장(UI/UX 디자인 가이드) 팔레트.
        // Claude Design 목업("부동산 계산기.dc.html")을 그대로 이식하며 추가한 토큰들.
        navy: "#0A2540",
        cobalt: "#0066FF",
        cyan: "#00D2FF",
        mist: {
          DEFAULT: "#EAF1F8",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        plexkr: ["var(--font-plex-kr)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
