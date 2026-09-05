// ============================================================
// [X-30 / 지시 035 5-1-4] 디자인실 「도구 계열 이름표」를 그대로 옮겼습니다.
// 원본: C:\dev\_인수인계\X-30_통합안\tokens\도구계열_v3.js
//
// 원본이 적어 둔 시점은 「플레이 심사 통과 뒤」였으나, 지시 035 0절 판정으로 앞당겼습니다.
// 심사가 아직 시작되지 않았으므로 미룰 시계가 돌고 있지 않습니다.
//
// ★ 값을 한쪽만 고치지 마십시오. 급여 계산기가 같은 파일을 씁니다.
// ★ 글꼴은 여기서 이름(sans)만 정하고, 실제로 불러오는 자리는 app/layout.tsx 한 곳입니다.
// ============================================================

const colors = {
  bg: "#f3f6fa",
  surface: "#ffffff",
  ink: "#16232e",
  "ink-2": "#4e5968",
  sub: "#8b95a1",
  line: "#e5e8eb",
  brand: "#0066ff",        // = cobalt
  "brand-dark": "#0a2540", // = navy
  "brand-soft": "#eaf1f8", // = mist
  ok: "#2e9e5b",
  warn: "#d56828",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        // 기존 화면이 쓰는 이름. 재도장 때 걷어냅니다.
        navy: "#0a2540",
        cobalt: "#0066ff",
        cyan: "#00d2ff",
        mist: { DEFAULT: "#eaf1f8", light: "#f8fafc" },
        toss: { blue: "#3182f6", bg: "#f2f4f6" },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', "Pretendard", "-apple-system",
               "BlinkMacSystemFont", "system-ui", '"Apple SD Gothic Neo"',
               '"Noto Sans KR"', '"Malgun Gothic"', "sans-serif"],
      },
      borderRadius: { lg: "8px", xl: "12px", "2xl": "16px" },
      boxShadow: {
        card: "0 1px 3px rgb(0 0 0 / 0.06)",
        sheet: "0 8px 24px rgb(0 0 0 / 0.12)",
      },
    },
  },
  plugins: [],
};
