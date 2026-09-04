"use client";

// 채널톡 위젯 부팅 트리거. 화면에 아무것도 렌더링하지 않고, 마운트 시 1회
// bootChannelTalk()를 호출해 우측 하단 채널 버튼을 띄운다.

import { useEffect } from "react";
import { bootChannelTalk } from "@/lib/channelTalk";

export default function ChannelTalk() {
  useEffect(() => {
    bootChannelTalk();
  }, []);

  return null;
}
