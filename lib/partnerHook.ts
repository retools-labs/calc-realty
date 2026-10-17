const PLAY_REFERRER = "android-app://kr.retools.realtycalc";
const PLAY_COOKIE = "rt_play=1";

export const PARTNER_HOOK_URLS = {
  play: "https://retools.kr/book/realty?utm_source=play_realtycalc&utm_medium=app&utm_campaign=hook_card",
  web: "https://retools.kr/book/realty?utm_source=web_realtycalc&utm_medium=web",
} as const;

export function getPartnerHookUrl(isPlay: boolean): string {
  return isPlay ? PARTNER_HOOK_URLS.play : PARTNER_HOOK_URLS.web;
}

export function hasPlayCookie(cookie: string): boolean {
  return cookie.split(";").some((part) => part.trim() === PLAY_COOKIE);
}

export function detectPlayVisit(): boolean {
  if (typeof window === "undefined") return false;

  const referrer = document.referrer;
  const fromPlay = referrer === PLAY_REFERRER || referrer.startsWith(`${PLAY_REFERRER}/`);
  if (fromPlay) {
    document.cookie = `${PLAY_COOKIE}; Max-Age=31536000; Path=/; SameSite=Lax`;
    return true;
  }

  return hasPlayCookie(document.cookie);
}

export function isTossSurface(): boolean {
  if (typeof window === "undefined") return false;
  const surface = window as Window & { IS_TOSS?: boolean; __IS_TOSS__?: boolean };
  return surface.IS_TOSS === true || surface.__IS_TOSS__ === true;
}
