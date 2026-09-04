// ============================================================
// PostHog 계측 얇은 래퍼.
//
// [2026-09-04 R-11] 이 서비스에는 계측이 하나도 없었다. Vercel Analytics 도 꺼져
// 있어서 누가 얼마나 쓰는지 아무도 모르는 상태였다. 총괄이 볼 것으로 정한 셋은
// 「어디서 들어오는가 · 계산까지 가는가 · 어디서 나가는가」다.
//
// ── 왜 동적 import 인가
// posthog-js 는 세션 리플레이를 포함해 첫 화면에 실리면 부담이 되는 크기다. 이 서비스는
// 휴대폰에서 열어 금액 하나 넣고 닫는 계산기라 첫 화면이 늦어지면 그것 자체가 이탈이
// 된다. 계측하려다 계측 대상을 망치는 셈이다. 그래서 화면이 뜬 뒤에 따로 불러온다.
// 불러오는 동안 일어난 이벤트는 큐에 담았다가 준비되면 한꺼번에 보낸다.
//
// ── 세션 리플레이 — 끈다 (2026-09-04 R-19, 총괄 판정)
//
// 처음에는 켰다. 로그인이 없고 개인정보를 받지 않으므로 켤 수 있다고 보았다.
// 총괄이 다시 판정해 끄는 것으로 정했다. 이유가 셋이다.
//
//   계산기에 리플레이가 필요한 이유가 없다. 이 앱은 유입 도구이고 유입은 페이지뷰와
//   이벤트로 센다. 리플레이는 화면 조작을 다시 보는 기능인데 볼 사람도 볼 이유도 없다.
//
//   구글 플레이 데이터 보안 신고가 단순해진다. 켠 채로는 「앱 활동」 수집을 신고하고
//   개인정보처리방침에 리플레이를 적어야 한다. 끄면 그 줄이 통째로 빠진다.
//
//   계측을 통째로 미루는 안은 받지 않았다. 미루면 등록 뒤에 데이터 보안 양식을 다시
//   내야 하고, 유입 도구를 두고 유입을 못 재는 기간이 생긴다.
//
// 페이지뷰와 이탈 시점은 그대로 남긴다. 「어디서 들어오는가 · 계산까지 가는가 ·
// 어디서 나가는가」 가운데 리플레이가 맡던 몫은 이벤트로도 충분히 보인다.
//
//   ※ 오늘하루 급여 본체에도 리플레이를 붙이지 말 것. 그쪽은 직원 이름과 급여가
//     화면에 있어서 마스킹 설계를 먼저 해야 한다.
//
// ── 키가 없을 때
// 아무 일도 하지 않는다. 채널톡 래퍼와 같은 방식이다. 키를 넣지 않은 환경(로컬 개발,
// 미리보기 배포)에서 계측만 조용히 꺼지고 앱은 그대로 동작한다.
// ============================================================

// loaded 콜백이 넘겨주는 인스턴스 타입. posthog-js 의 PostHog 클래스와
// PostHogInterface 가 서로 다르므로 콜백 인자에서 그대로 뽑아 쓴다.
import type { PostHogConfig } from "posthog-js";

type PostHogClient = Parameters<NonNullable<PostHogConfig["loaded"]>>[0];
import { detectSurface } from "./surface";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// PostHog 클라우드 지역에 따라 주소가 다르다(미국 us / 유럽 eu). 프로젝트를 만들 때
// 받은 값을 그대로 넣는다. 비워 두면 미국 기본값을 쓴다.
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let client: PostHogClient | null = null;
let starting = false;
/** posthog 를 불러오는 동안 쌓인 이벤트. 준비되면 순서대로 보낸다. */
const pending: { event: string; properties?: Record<string, unknown> }[] = [];
/** 큐가 무한히 자라지 않도록 상한을 둔다. 계측이 앱의 메모리를 먹으면 안 된다. */
const PENDING_LIMIT = 50;

function flush() {
  if (!client) return;
  while (pending.length) {
    const item = pending.shift()!;
    try {
      client.capture(item.event, item.properties);
    } catch {
      // 계측 실패가 계산기를 멈추게 해서는 안 된다.
    }
  }
}

/** 앱 진입 시 1회 호출. 화면이 뜬 뒤 posthog 를 따로 불러온다. */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (client || starting) return;
  if (!KEY) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[analytics] NEXT_PUBLIC_POSTHOG_KEY 미설정 - 계측 비활성화됨");
    }
    return;
  }
  starting = true;

  const { surface, androidPackage } = detectSurface();

  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        // 첫 화면 진입과 이탈을 자동으로 남긴다. 이탈 시점이 있어야 어디서 나갔는지 본다.
        capture_pageview: true,
        capture_pageleave: true,
        // [2026-09-04 R-19] 세션 리플레이를 끈다. 이 값이 true 인 동안에는 화면 녹화가
        // 일어나지 않으므로, 구글 플레이 데이터 보안에 「앱 활동」을 신고하지 않아도 된다.
        // 다시 켜려면 총괄 판정이 필요하고, 켜는 순간 데이터 보안 양식과
        // 개인정보처리방침을 함께 고쳐야 한다.
        disable_session_recording: true,
        loaded: (ph) => {
          // 모든 이벤트에 유입 표면을 붙인다. 이것이 있어야 플레이 등록 뒤에
          // 앱 유입과 웹 유입을 갈라서 볼 수 있다.
          ph.register({
            surface,
            is_twa: surface === "twa",
            android_package: androidPackage,
            // /calc 서브패스 배포와 루트 배포(calc-realty.vercel.app, 안드로이드 앱 연결)를 구분한다.
            deploy_target: process.env.NEXT_PUBLIC_BASE_PATH ? "embed" : "root",
          });
          client = ph;
          flush();
        },
      });
    })
    .catch(() => {
      // 광고 차단기 등으로 스크립트를 못 불러오는 경우가 있다. 조용히 포기하고
      // 큐를 비워 메모리를 돌려준다.
      starting = false;
      pending.length = 0;
    });
}

/** 이벤트 1건. 계측이 꺼져 있으면 아무 일도 하지 않는다. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!KEY) return;
  if (!client) {
    if (pending.length < PENDING_LIMIT) pending.push({ event, properties });
    return;
  }
  try {
    client.capture(event, properties);
  } catch {
    // 계측 실패가 계산기를 멈추게 해서는 안 된다.
  }
}
