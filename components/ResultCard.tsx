"use client";

// design-preview: 마스터플랜 4장 UI 가이드(Claude Design 목업 "부동산 계산기.dc.html")의
// 네이비 결과 카드 패턴을 재사용 가능한 조각들로 분리했다. 각 계산기는 이 조각들을 조합해서
// 헤드라인(큰 시안 숫자) + 상세 행 목록 + (선택) 하이라이트 서브박스 구조를 만든다.

export function ResultCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-navy p-5 text-white shadow-[0_10px_30px_rgba(10,37,64,0.25)] ${className}`}>
      {children}
    </div>
  );
}

export function ResultHeadline({
  label,
  value,
  suffix,
  subtitle,
}: {
  label: string;
  value: string;
  suffix?: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-[#7FA3C7]">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1 font-sora">
        <span className="text-[34px] font-extrabold leading-none tracking-tight text-cyan">{value}</span>
        {suffix && <span className="text-lg font-bold text-cyan">{suffix}</span>}
      </div>
      {subtitle && <div className="mt-1.5 text-sm text-[#7FA3C7]">{subtitle}</div>}
    </div>
  );
}

export function ResultDivider() {
  return <div className="my-4 border-t border-white/10" />;
}

export function ResultRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-[#7FA3C7]">{label}</span>
      <span className={`text-sm ${strong ? "font-bold text-white" : "font-semibold text-white"}`}>{value}</span>
    </div>
  );
}

// 사무소 수령액 / 세금+부대비용 합계 / 월 순수익 처럼, 결과 카드 안에서 한 번 더 강조해야
// 하는 하위 계산 결과를 담는 어두운 서브박스.
export function ResultHighlight({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 space-y-1.5 rounded-xl bg-black/25 p-4">{children}</div>;
}

export function ResultHighlightRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={emphasize ? "text-sm font-semibold text-[#BFE3FF]" : "text-sm text-[#7FA3C7]"}>{label}</span>
      <span
        className={
          emphasize
            ? "font-sora text-xl font-extrabold text-cyan"
            : "text-sm font-semibold text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function ResultNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-[#9AA5B1]">{children}</p>;
}
