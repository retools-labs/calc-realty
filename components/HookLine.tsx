"use client";

import { track } from "@/lib/analytics";
import { PARTNER_URL, type Hook } from "@/lib/hook";
import { useHook } from "@/lib/hookContext";

// X-45 후킹 줄. **단추가 아니라 줄이다.**
// 사용자는 방금 누를 것을 이미 눌렀고(복사·저장) 또는 지금 답을 읽는 중이다(정산).
// 글자는 결과 숫자보다 작다. 후킹이 답보다 커지면 그때부터 광고로 읽힌다.
// 도구 계열이므로 락업 뱃지를 달지 않는다(정본 2절).
// [3단계] tab·mode 는 prop 이 아니라 컨텍스트에서 읽는다. 계산기가 자기 탭 이름을 적지 않는다.
export default function HookLine({
  place,
  text,
  linkText,
}: {
  place: Exclude<Hook, null>;
  text: string;
  linkText: string;
}) {
  const { tab, mode } = useHook();
  return (
    <div className="mt-2 rounded-xl border-[1.5px] border-cobalt bg-white px-3.5 py-2.5">
      <p className="text-[13px] leading-relaxed text-[#4E5968]">
        {text}{" "}
        <a
          href={PARTNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("hook_clicked", { place, tab, mode })}
          className="whitespace-nowrap font-semibold text-cobalt"
        >
          {linkText}
        </a>
      </p>
    </div>
  );
}
