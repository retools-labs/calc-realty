"use client";

import { useState, type RefObject } from "react";

interface Props {
  targetRef: RefObject<HTMLElement>;
  fileName?: string;
}

// ReceiptCard를 이미지(PNG)로 캡처해서, 모바일에서는 카카오톡 등으로 바로 공유(Web Share API),
// 지원 안 되는 환경(대부분의 PC 브라우저)에서는 파일 다운로드로 대체한다.
// html2canvas는 번들 크기가 있어 클릭 시점에 동적 import로 불러온다.
export default function ShareReceiptButton({ targetRef, fileName = "리얼티북_계산결과.png" }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!targetRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("이미지 생성 실패");

      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };

      if (nav.canShare && nav.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "리얼티북 계산 결과" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch {
      setError("이미지 생성/공유에 실패했어요. 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="mt-3 w-full rounded-xl border border-[#14607F] py-3 text-sm font-semibold text-[#14607F] transition active:scale-[0.99] disabled:opacity-50"
      >
        {busy ? "이미지 생성 중..." : "영수증 카드 이미지로 저장·공유"}
      </button>
      {error && <p className="mt-1 text-center text-xs text-red-500">{error}</p>}
    </div>
  );
}
