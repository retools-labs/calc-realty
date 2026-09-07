"use client";

import { PRODUCT_NAME_SHORT } from "@/lib/productName";
import { useHook } from "@/lib/hookContext";
import HookLine from "./HookLine";

// X-45 후킹 B(챙겨가기 줄). 여섯 탭이 같은 문장을 쓰므로 한 곳에서 그린다.
// 복사·저장이 실제로 끝난 뒤(showHook("carry")) 두 단추 바로 아래에 한 줄로 선다.
// 문장은 X-45 구현지시서 정본 그대로다. 탭마다 다르게 쓰지 않는다.
export default function CarryLine() {
  const { hook } = useHook();
  if (hook !== "carry") return null;
  return (
    <HookLine
      place="carry"
      text="계산기는 이 건을 들고 있지 않습니다."
      linkText={`${PRODUCT_NAME_SHORT}는 남깁니다 →`}
    />
  );
}
