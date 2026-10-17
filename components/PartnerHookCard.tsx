"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { PRODUCT_NAME } from "@/lib/productName";
import { detectPlayVisit, getPartnerHookUrl } from "@/lib/partnerHook";

export default function PartnerHookCard() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(getPartnerHookUrl(detectPlayVisit()));
  }, []);

  if (!url) return null;

  return (
    <div className="mt-4 rounded-xl border border-[#F36F21] bg-white p-4">
      <h2 className="text-base font-bold leading-6 text-navy text-pretty">
        중개수수료 정산·장부는 {PRODUCT_NAME}로
      </h2>
      <p className="mt-1 text-sm leading-5 text-[#4E5968]">공동중개 몫 나누기 · 월말 정산 한 장</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("hook_clicked", { place: "card" })}
        className="mt-4 block rounded-lg bg-[#F36F21] px-2 py-2.5 text-center text-[13px] font-semibold leading-5 text-white transition-colors hover:bg-[#D95D16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36F21] focus-visible:ring-offset-2"
      >
        {PRODUCT_NAME} 무료로 시작 →
      </a>
    </div>
  );
}
