const PLAY_REFERRER = "android-app://kr.retools.realtycalc";
// 쿠키가 아니라 sessionStorage 에 둔다. TWA 는 크롬과 쿠키를 함께 써서, 쿠키로 남기면
// 플레이 앱을 한 번 연 폰의 일반 크롬 방문까지 플레이로 읽힌다(utm 이 틀어진다).
// sessionStorage 는 그 앱 화면 안에서만 산다. 앱을 다시 열면 referrer 가 다시 온다.
const PLAY_SESSION_KEY = "rt_play";

export const PARTNER_HOOK_URLS = {
  play: "https://retools.kr/book/realty?utm_source=play_realtycalc&utm_medium=app&utm_campaign=hook_card",
  web: "https://retools.kr/book/realty?utm_source=web_realtycalc&utm_medium=web&utm_campaign=hook_card",
} as const;

export function getPartnerHookUrl(isPlay: boolean): string {
  return isPlay ? PARTNER_HOOK_URLS.play : PARTNER_HOOK_URLS.web;
}

type PlayEnv = {
  referrer: string;
  storage: Pick<Storage, "getItem" | "setItem"> | null;
};

export function detectPlay({ referrer, storage }: PlayEnv): boolean {
  try {
    if (storage?.getItem(PLAY_SESSION_KEY) === "1") return true;
  } catch {}

  const fromPlay = referrer === PLAY_REFERRER || referrer.startsWith(`${PLAY_REFERRER}/`);
  if (!fromPlay) return false;

  try {
    storage?.setItem(PLAY_SESSION_KEY, "1");
  } catch {}
  return true;
}

export function detectPlayVisit(): boolean {
  if (typeof window === "undefined") return false;

  let storage: Storage | null = null;
  try {
    storage = window.sessionStorage;
  } catch {}
  return detectPlay({ referrer: document.referrer, storage });
}
