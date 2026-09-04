// ============================================================
// 유입 표면(surface) 판별 — 안드로이드 TWA 앱인가, 설치형 PWA인가, 그냥 웹인가.
//
// [2026-09-04 R-11] 구글 플레이에 올린 앱(TWA)은 같은 웹페이지를 그대로 띄운다.
// 주소도 같고 코드도 같다. 그래서 계측을 붙여도 앱에서 들어온 사람과 브라우저로
// 들어온 사람이 한 덩어리로 섞인다. 플레이 등록의 효과를 재려면 이 둘을 갈라야 한다.
//
// 판별 근거는 document.referrer 다. TWA 는 첫 진입에서 referrer 를
// "android-app://<패키지명>" 으로 넘긴다. 구글이 TWA 유입을 구분하라고 정해 둔 값이고,
// 앱 안의 크롬이 붙여 주므로 우리 쪽 코드만으로 읽을 수 있다.
//
// 이 방법을 고른 이유가 하나 더 있다. app-release-bundle.aab 는 이미 빌드가 끝나
// 대표님 업로드만 남은 상태다. 시작 주소에 ?utm_source=twa 같은 표시를 넣는 방법도
// 있지만 그러려면 .aab 를 다시 빌드해야 한다. referrer 방식은 이미 만들어 둔 그
// 파일을 그대로 올려도 동작한다.
//
// display-mode: standalone 은 TWA 와 설치형 PWA 가 똑같이 true 라 이 둘을 가르지
// 못한다. 그래서 standalone 은 TWA 가 아닐 때 PWA 를 가려내는 데만 쓴다.
//
// referrer 는 첫 진입에서만 값이 있으므로 세션스토리지에 기억해 둔다. 이 서비스는
// 한 페이지 안에서 탭만 바뀌는 구조라 실제로 다시 읽을 일은 드물지만, 새로고침이나
// 뒤로가기로 referrer 가 비었을 때 앱 유입이 웹으로 뒤바뀌는 것을 막는다.
// ============================================================

export type Surface = "twa" | "pwa" | "web";

export interface SurfaceInfo {
  surface: Surface;
  /** TWA 일 때 안드로이드 패키지명(예: kr.retools.realtycalc). 그 외에는 undefined. */
  androidPackage?: string;
}

const ANDROID_APP_PREFIX = "android-app://";
const STORAGE_KEY = "rb_surface";

function readRemembered(): SurfaceInfo | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SurfaceInfo;
    return parsed && parsed.surface ? parsed : null;
  } catch {
    // 시크릿 모드나 저장소 차단 환경에서는 조용히 포기한다. 판별은 계속 동작한다.
    return null;
  }
}

function remember(info: SurfaceInfo) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // 저장에 실패해도 이번 페이지 안에서는 판별값이 살아 있으므로 그냥 넘어간다.
  }
}

function isStandalone(): boolean {
  try {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

/** 지금 이 방문이 어디서 왔는지 판별한다. 서버에서는 호출하지 않는다. */
export function detectSurface(): SurfaceInfo {
  if (typeof window === "undefined") return { surface: "web" };

  const referrer = document.referrer || "";
  if (referrer.startsWith(ANDROID_APP_PREFIX)) {
    const androidPackage = referrer.slice(ANDROID_APP_PREFIX.length).replace(/\/.*$/, "");
    const info: SurfaceInfo = { surface: "twa", androidPackage: androidPackage || undefined };
    remember(info);
    return info;
  }

  // referrer 가 비어 있어도 같은 세션에서 이미 앱으로 판별했다면 그것을 따른다.
  const remembered = readRemembered();
  if (remembered?.surface === "twa") return remembered;

  const info: SurfaceInfo = { surface: isStandalone() ? "pwa" : "web" };
  remember(info);
  return info;
}
