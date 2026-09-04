// ============================================================
// 대외 표기 값이 정본과 갈렸는지 빌드 전에 확인한다.
//
// [2026-09-04 R-18] 이 저장소의 사업자정보가 낡은 채로 대외 화면에 나가고 있었다.
// 고객센터 자리에 대표 개인 휴대폰이 찍혀 있었고, 통신판매업은 이미 발급된 신고번호
// 대신 「신고 진행 중」이었다.
//
// 같은 값이 realtybook 저장소에도 있다. 그 파일에는 「값이 바뀌면 두 곳 다 고쳐야
// 한다」는 주석이 원래도 적혀 있었는데 한쪽만 고쳐졌다. 주석은 그 파일을 연 사람에게만
// 작동하고, 값을 고치는 사람은 대개 한 저장소만 연다.
//
// 그래서 주석 대신 검사로 막는다. 이 스크립트는 package.json 의 prebuild 에 걸려
// 있어서 npm run build 앞에 자동으로 돈다. 로컬 빌드에서도 돌고 Vercel 빌드에서도
// 돈다. 값이 어긋나면 빌드가 실패하므로 틀린 값이 대외로 나갈 수 없다.
//
// 값을 바꾸는 순서는 언제나 이렇다. 정본 대장 → 이 파일 → lib/retoolsInfo.ts.
// 이 파일을 고치지 않고 코드만 고치면 빌드가 막힌다. 그것이 이 검사의 목적이다.
//
// 시험 도구를 새로 들이지 않은 이유: vitest 가 이 저장소의 @types/node 20 과
// 충돌한다. 이미 있는 tsx 로 도는 스크립트면 충분하고, prebuild 에 걸면 배포
// 스크립트뿐 아니라 Vercel 빌드까지 막아 준다.
// ============================================================

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { POLICY_BASE_URL, RETOOLS_INFO } from "../lib/retoolsInfo";

/** 「[리툴스] 대외 표기 정본 대장 (상시 갱신)」 4절 사업자 정보에서 옮겨 적은 값. */
const 정본 = {
  companyName: "리툴스 (RETOOLS LABS)",
  ceoName: "박종찬",
  businessRegistrationNo: "141-52-01181",
  mailOrderRegistrationNo: "제2026-부산사상구-0385호",
  address: "부산광역시 사상구 백양대로 372-22, 109동 1303호",
  phone: "070-5236-4803",
} as const;

/** 대외 화면에 절대 나가면 안 되는 값. */
const 금지값 = [
  { 값: "010-6540-5894", 이유: "대표 개인 휴대폰" },
  { 값: "01065405894", 이유: "대표 개인 휴대폰(하이픈 없는 형태)" },
  { 값: "apple-realty.vercel.app", 이유: "리얼티북 옛 도메인" },
];

const 문제: string[] = [];

// 1) 사업자정보가 정본과 같은가
for (const [key, expected] of Object.entries(정본)) {
  const actual = (RETOOLS_INFO as Record<string, unknown>)[key];
  if (actual !== expected) {
    문제.push(`RETOOLS_INFO.${key}\n    지금  ${String(actual)}\n    정본  ${expected}`);
  }
}

// 2) 약관·방침 주소가 쓸 수 있는 형태인가
if (POLICY_BASE_URL.includes("vercel.app") || POLICY_BASE_URL.includes("apple-realty")) {
  문제.push(`POLICY_BASE_URL 이 옛 도메인입니다: ${POLICY_BASE_URL}`);
}
if (POLICY_BASE_URL.includes("xn--")) {
  // 구글 플레이가 개인정보처리방침 URL 을 크롤러로 읽는다. 한글 도메인이 퓨니코드로
  // 실리면 반려된 전례가 있어 심사 기간에는 영문 주소만 쓴다.
  문제.push(`POLICY_BASE_URL 에 퓨니코드가 들어 있습니다: ${POLICY_BASE_URL}`);
}

// 3) 금지값이 코드 어딘가에 하드코딩되어 남아 있지 않은가
//    한 곳을 고쳐도 다른 화면에 박혀 있으면 그대로 나간다.
const 대상폴더 = ["app", "components", "lib"];
const 제외파일 = ["retoolsInfo.ts"]; // 무엇이 틀렸었는지 적어 둔 주석이 있다

function 훑기(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      훑기(full);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name)) continue;
    if (제외파일.includes(name)) continue;
    const text = readFileSync(full, "utf8");
    for (const { 값, 이유 } of 금지값) {
      if (text.includes(값)) {
        문제.push(`${path.relative(process.cwd(), full)} 에 ${값} (${이유})`);
      }
    }
  }
}
for (const d of 대상폴더) 훑기(path.resolve(process.cwd(), d));

if (문제.length) {
  console.error("");
  console.error("대외 표기 값이 정본과 다릅니다. 빌드를 멈춥니다.");
  console.error("");
  console.error("정본은 「[리툴스] 대외 표기 정본 대장 (상시 갱신)」 4절입니다.");
  console.error("대장을 먼저 고치고, 이 스크립트의 정본 값을 고치고, 그 다음 코드를 고치십시오.");
  console.error("");
  for (const m of 문제) console.error(`  · ${m}`);
  console.error("");
  process.exit(1);
}

console.log("대외 표기 값 확인 완료 — 정본 대장 4절과 일치합니다.");
