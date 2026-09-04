"use client";

// PostHog 부팅 트리거. 화면에 아무것도 렌더링하지 않고, 마운트 시 1회 initAnalytics()를
// 호출한다. ChannelTalk 컴포넌트와 같은 모양이다.

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

export default function Analytics() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
