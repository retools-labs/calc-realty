"use client";

// ============================================================
// X-45 3단계 — 후킹 상태를 prop 두 개(hook·showHook)로 내리던 것을 컨텍스트로 바꾼다.
//
// 1·2단계에서는 복비 탭 하나만 받았으므로 prop 두 개로 충분했다. 3단계에서 나머지 다섯 탭이
// 같은 두 값을 받게 되면 여섯 곳에 같은 prop 이 늘어서고, 한 곳만 빠뜨려도 그 탭에서만
// 후킹이 조용히 사라진다. 상태는 app/page.tsx 한 곳이 쥐고, 계산기는 useHook() 으로 읽는다.
//
// tab·mode 를 함께 담는 이유: HookLine 이 계측(hook_clicked)에 그 둘을 붙이는데,
// 계산기마다 자기 탭 이름을 글자로 적게 하면 언젠가 하나가 틀린다.
// ============================================================
import { createContext, useContext } from "react";
import type { Hook, ShowHook } from "./hook";

export type HookMode = "customer" | "agent";

export type HookContextValue = {
  hook: Hook;
  showHook: ShowHook;
  tab: string;
  mode: HookMode;
};

// Provider 밖에서 그려질 때(시험·미리보기)는 후킹이 아무것도 하지 않는다. 계산은 그대로 된다.
const HookContext = createContext<HookContextValue>({
  hook: null,
  showHook: () => {},
  tab: "",
  mode: "customer",
});

export const HookProvider = HookContext.Provider;

export function useHook(): HookContextValue {
  return useContext(HookContext);
}
