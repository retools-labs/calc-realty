"use client";

// ============================================================
// '홈 화면에 추가' 안내 배너.
// - 안드로이드(Chrome 등): beforeinstallprompt 이벤트를 잡아두었다가
//   버튼을 누르면 즉시 브라우저 설치 팝업을 띄운다.
// - 아이폰(Safari): beforeinstallprompt를 지원하지 않으므로 공유 버튼(⬆)을
//   눌러 '홈 화면에 추가'를 선택하라는 안내 툴팁을 보여준다.
// - 이미 PWA로 설치되어 실행 중(standalone)이면 아예 표시하지 않는다.
// - 사용자가 닫거나 설치를 완료하면 7일 동안 다시 뜨지 않는다(localStorage).
// ============================================================

import { useEffect, useState } from "react";
import { BASE_PATH } from "@/lib/basePath";
import { track } from "@/lib/analytics";

const DISMISS_KEY = "rb-install-prompt-dismissed-at";
const DISMISS_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari 전용 플래그
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /safari/i.test(ua) && !/crios|fxios|chrome|android/i.test(ua);
}

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;
  const elapsedDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return elapsedDays < DISMISS_DAYS;
}

function markDismissed() {
  window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // 서비스워커 등록은 배너 노출 여부와 무관하게 항상 시도한다(설치 가능 조건 충족용).
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${BASE_PATH}/sw.js`).catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    // 아이폰 Safari: beforeinstallprompt 미지원 → 안내 배너만 노출
    if (isIos() && isSafari()) {
      setPlatform("ios");
      setVisible(true);
      return;
    }

    // 안드로이드 Chrome 등: 설치 가능 이벤트가 오면 배너 노출
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android");
      setVisible(true);
    }

    function handleAppInstalled() {
      // [2026-09-04 R-11] 홈 화면 설치는 다시 찾아올 사람이라는 신호다.
      // 구글 플레이 앱(TWA)과는 다른 경로이므로 따로 센다.
      track("pwa_installed");
      markDismissed();
      setVisible(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  function handleClose() {
    track("pwa_install_banner_dismissed", { platform });
    markDismissed();
    setVisible(false);
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      track("pwa_install_prompt_answered", { outcome });
      if (outcome === "accepted") markDismissed();
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
      setVisible(false);
    }
  }

  if (!visible || !platform) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:flex sm:justify-center">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-[#0d3b52]/10 bg-white p-4 shadow-lg">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d3b52] to-[#1c7fa0] text-sm font-extrabold text-white">
          RB
        </div>

        {platform === "android" ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#16232E]">부동산 계산기 앱으로 설치하기</p>
              <p className="mt-0.5 text-xs text-[#8B95A1]">홈 화면에 추가하고 앱처럼 바로 실행해보세요.</p>
            </div>
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={installing}
              className="shrink-0 rounded-xl bg-gradient-to-r from-[#0d3b52] to-[#1c7fa0] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {installing ? "설치 중..." : "설치하기"}
            </button>
          </>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#16232E]">홈 화면에 추가하기</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B95A1]">
              하단 공유 버튼(<span aria-hidden>⬆️</span>)을 누른 뒤 <b className="text-[#14607F]">&lsquo;홈 화면에 추가&rsquo;</b>를 선택하면 앱처럼 바로 실행할 수 있어요.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleClose}
          aria-label="닫기"
          className="shrink-0 rounded-full p-1 text-[#B0B8C1] hover:bg-gray-100 hover:text-[#4E5968]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
