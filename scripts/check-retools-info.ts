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

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { POLICY_BASE_URL, RETOOLS_INFO } from "../lib/retoolsInfo";
import {
  CALC_PRODUCT_NAME,
  PRODUCT_NAME,
  PRODUCT_NAME_LEGACY,
  PRODUCT_NAME_SHORT,
} from "../lib/productName";

/** 「[리툴스] 대외 표기 정본 대장 (상시 갱신)」 4절 사업자 정보에서 옮겨 적은 값. */
const 정본 = {
  companyName: "리툴스", // [R-21] 등록증 표기. "(RETOOLS LABS)" 를 붙이지 않는다
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

// 4) 계산기 전용 개인정보처리방침이 제자리에 있는가
//    [2026-09-05 R-20] 구글 플레이에 낸 방침 URL 이 calc-realty.vercel.app/privacy 다.
//    이 페이지가 없어지면 크롤러가 404 를 읽고 앱이 반려된다. 등재한 주소가 죽는 것은
//    값이 틀린 것과 같은 등급의 사고이므로 같은 자리에서 막는다.
const 방침페이지 = path.resolve(process.cwd(), "app", "privacy", "page.tsx");
if (!existsSync(방침페이지)) {
  문제.push(
    "app/privacy/page.tsx 가 없습니다. 구글 플레이에 낸 방침 URL(/privacy)이 404 가 됩니다"
  );
}

//    푸터의 개인정보처리방침 링크는 계산기 제 방침을 가리켜야 한다. 리얼티북 방침
//    (POLICY_BASE_URL)을 가리키면 심사자와 이용자가 이 앱과 무관한 문서를 보게 된다.
const 푸터 = readFileSync(path.resolve(process.cwd(), "components", "Footer.tsx"), "utf8");
if (푸터.includes("${POLICY_BASE_URL}/privacy")) {
  문제.push(
    "components/Footer.tsx 의 개인정보처리방침 링크가 리얼티북 방침을 가리킵니다. `${BASE_PATH}/privacy` 로 적으십시오"
  );
}

// 5) 장부 제품 이름이 realtybook 저장소의 정본과 같은가
//    [2026-09-05 R-20] 「리얼티북」에서 「오늘하루 장부-부동산중개」로 바꿨다. 정본은
//    realtybook 저장소의 src/lib/productName.ts 이고, 저장소가 달라 코드로 묶이지 않는다.
//    사업자정보와 같은 문제이므로 같은 자리에서 막는다.
const 제품명정본 = {
  PRODUCT_NAME: "오늘하루 장부-부동산중개",
  PRODUCT_NAME_SHORT: "오늘하루 장부",
  PRODUCT_NAME_LEGACY: "리얼티북",
} as const;
const 지금제품명 = { PRODUCT_NAME, PRODUCT_NAME_SHORT, PRODUCT_NAME_LEGACY };
for (const [key, expected] of Object.entries(제품명정본)) {
  const actual = (지금제품명 as Record<string, string>)[key];
  if (actual !== expected) {
    문제.push(`productName.${key}\n    지금  ${actual}\n    정본  ${expected}`);
  }
}

//    이름을 코드에 직접 적으면 다음 변경 때 이 자리를 빠뜨린다. 이 회사는 한 달에
//    제품 이름을 두 번 바꿨다.
const 제품명파일 = path.join("lib", "productName.ts");
const 옛이름허용: Record<string, string> = {
  [path.join("lib", "retoolsInfo.ts")]: "상표 출원명. 40-2026-0168198 은 「리얼티북」으로 낸 것이다",
  [path.join("components", "ReceiptCard.tsx")]:
    "CTA 이미지 안에 박힌 글자를 alt 가 그대로 적는다. 이미지 교체는 디자인실 몫이다",
  [path.join("components", "Footer.tsx")]: "R-20 이전 경위를 적어 둔 주석",
  [제품명파일]: "옛 이름을 상수로 정의하는 자리",
};
function 이름훑기(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      이름훑기(full);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name)) continue;
    const rel = path.relative(process.cwd(), full);
    // 주석은 경위 기록이라 옛 이름이 남아 있는 것이 맞다. 지우고 본문만 검사한다.
    // 문자열 안의 "//" 를 주석으로 잘못 보면 그 뒤가 검사에서 빠지므로, 줄 전체가
    // 주석인 줄과 블록 주석만 지운다. 덜 지우는 쪽으로 틀리게 만들었다.
    const text = readFileSync(full, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\*)/.test(line))
      .join("\n");
    if (rel !== 제품명파일 && text.includes(PRODUCT_NAME_SHORT)) {
      문제.push(`${rel} 에 제품 이름이 직접 적혀 있습니다. lib/productName.ts 의 상수를 쓰십시오`);
    }
    if (!옛이름허용[rel] && text.includes(PRODUCT_NAME_LEGACY)) {
      문제.push(`${rel} 에 옛 이름 ${PRODUCT_NAME_LEGACY} 이 남아 있습니다`);
    }
  }
}
for (const d of 대상폴더) 이름훑기(path.resolve(process.cwd(), d));

//    manifest 는 정적 파일이라 상수를 읽지 못한다. 홈 화면에 뜨는 이름이라 어긋나면 눈에 띈다.
const 계산기manifest = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "public", "manifest.json"), "utf8")
) as { name?: string };
//    [2026-09-05 지시 036 부속 1] 예전에는 이 자리가 장부 이름을 가리켰다. 총괄이 정리해
//    이제 계산기 자신의 이름을 적는다. 설치된 앱의 이름을 말하는 자리이기 때문이다.
if (계산기manifest.name !== CALC_PRODUCT_NAME) {
  문제.push(
    `public/manifest.json 의 name 이 「${CALC_PRODUCT_NAME}」 가 아닙니다: ${계산기manifest.name}`
  );
}

// 6) 제품 이름 뒤의 조사가 이름의 받침에 맞는가
//    2026-09-05 에 실제로 낸 실수다. 옛 이름 「리얼티북」은 받침이 있어 과를 썼는데,
//    새 이름은 「…장부」로 끝나 받침이 없다. 이름만 갈아 끼우고 조사를 그대로 두어
//    「오늘하루 장부과 함께 만드는」이 라이브로 나갔다.
function 받침있음(word: string): boolean {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}
const 조사짝: [string, string][] = [
  ["은", "는"],
  ["이", "가"],
  ["을", "를"],
  ["과", "와"],
];
function 조사훑기(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      조사훑기(full);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(name)) continue;
    const rel = path.relative(process.cwd(), full);
    if (rel === 제품명파일) continue;
    const text = readFileSync(full, "utf8");
    for (const [상수이름, 값] of [
      ["PRODUCT_NAME", PRODUCT_NAME],
      ["PRODUCT_NAME_SHORT", PRODUCT_NAME_SHORT],
      ["PRODUCT_NAME_LEGACY", PRODUCT_NAME_LEGACY],
    ] as [string, string][]) {
      const 받침 = 받침있음(값);
      for (const [있을때, 없을때] of 조사짝) {
        const 틀림 = 받침 ? 없을때 : 있을때;
        const 맞음 = 받침 ? 있을때 : 없을때;
        const re = new RegExp("\\{" + 상수이름 + "\\}" + 틀림 + "(?=[\\s.,)\"'`]|&quot;)", "g");
        if (re.test(text)) {
          문제.push(
            rel + " 에서 " + 상수이름 + " 뒤에 「" + 틀림 + "」 를 썼습니다. 이름 「" + 값 +
              "」 의 마지막 글자에 받침이 " + (받침 ? "있습니다" : "없습니다") +
              ". 맞는 조사는 「" + 맞음 + "」 입니다"
          );
        }
      }
    }
  }
}
for (const d of 대상폴더) 조사훑기(path.resolve(process.cwd(), d));

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
