// 부동산 계산기 - 최소 서비스워커
// PWA 설치 조건을 유지하면서, 배포 뒤에도 최신 HTML과 CSS를 먼저 받는다.
const SCOPE_PATH = new URL(self.registration.scope).pathname;
const BASE = SCOPE_PATH.replace(/\/$/, "");
const CACHE_PREFIX = `realtybook-calc${BASE.replace(/\//g, "-")}-`;
const CACHE_NAME = `${CACHE_PREFIX}v2`;

const APP_SHELL = [
  `${BASE}/manifest.json`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-512.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function cacheResponse(request, response) {
  if (response && response.status === 200) {
    caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
  }
  return response;
}

function networkFirst(request, fallback) {
  return fetch(request)
    .then((response) => cacheResponse(request, response))
    .catch(() => fallback());
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(SCOPE_PATH)) return;

  const isNavigation = request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
  const isNextStatic = url.pathname.startsWith(`${BASE}/_next/static/`);

  if (isNextStatic) {
    event.respondWith(
      caches.match(request).then((cached) => cached || networkFirst(request, () => caches.match(request)))
    );
    return;
  }

  if (isNavigation) {
    event.respondWith(
      networkFirst(request, () => caches.match(request).then((cached) => cached || caches.match(`${BASE}/`)))
    );
    return;
  }

  event.respondWith(
    networkFirst(request, () => caches.match(request))
  );
});
