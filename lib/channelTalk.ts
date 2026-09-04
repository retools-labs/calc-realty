// ============================================================
// 채널톡(Channel Talk) CS 챗봇 SDK 얇은 래퍼.
// calc-realty는 로그인이 없는 익명 방문자 전용 서비스라 boot()는 pluginKey만 넘긴다.
// (참고: apple-realty-settlement 쪽은 로그인 사용자 프로필을 함께 넘기는 별도 버전을 둠 —
//  src/lib/channelTalk.ts + src/components/ChannelTalk.tsx)
//
// 공식 SDK: @channel.io/channel-web-sdk-loader
// https://developers.channel.io/docs/web-quickstart
//
// 서포트봇 시나리오(FAQ 버튼, 리드 수집 폼 등)는 코드가 아니라 채널톡 관리자 콘솔
// (desk.channel.io)에서 직접 구성해야 한다 — CLAUDE.md의 "채널톡 콘솔 설정 가이드" 참고.
// ============================================================

import * as ChannelService from "@channel.io/channel-web-sdk-loader";

const PLUGIN_KEY = process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY;

let booted = false;

function warnMissingKey() {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "[channelTalk] NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY 미설정 - 채널톡 위젯 비활성화됨"
    );
  }
}

/** 앱 진입 시 1회 호출. 익명 방문자 상태로 채널톡 위젯을 부팅한다. */
export function bootChannelTalk() {
  if (typeof window === "undefined") return; // 서버에서는 절대 호출 금지
  if (!PLUGIN_KEY) {
    warnMissingKey();
    return;
  }
  if (booted) return;
  booted = true;

  ChannelService.loadScript();
  ChannelService.boot({
    pluginKey: PLUGIN_KEY,
    hideChannelButtonOnBoot: false,
  });
}

/** 위젯을 완전히 종료한다 (calc-realty는 로그인이 없어 평소엔 호출할 일이 거의 없음). */
export function shutdownChannelTalk() {
  if (typeof window === "undefined") return;
  ChannelService.shutdown();
  booted = false;
}

/** 커스텀 버튼("도움이 필요하세요?" 등)에서 채팅창을 직접 열고 싶을 때 사용. */
export function showChannelTalkMessenger() {
  if (typeof window === "undefined") return;
  ChannelService.showMessenger();
}
