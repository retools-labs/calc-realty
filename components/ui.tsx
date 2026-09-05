"use client";

// 계산기들끼리 공유하는 작은 UI 부품 모음 (복비 계산기용으로 만들었던 걸
// 일할계산기에서도 그대로 재사용하기 위해 분리함).

export function parseWon(raw: string): number {
  const n = Number(raw.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

// 금액을 "n억 n천만원" 식 한글 단위 힌트로 변환. WonInput 아래 보조 텍스트로 노출해서
// 자릿수를 세지 않아도 입력값이 맞는지 바로 확인할 수 있게 한다.
export function formatKoreanUnit(n: number): string {
  if (!n || n <= 0) return "";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const won = n % 10_000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (parts.length === 0) {
    // 만원 미만 소액은 그대로 원 단위로 보여준다.
    return `${won.toLocaleString("ko-KR")}원`;
  }
  return `${parts.join(" ")}원`;
}

export function WonInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  const hint = formatKoreanUnit(value);
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#4E5968]">{label}</span>
      <div className="flex items-center rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 focus-within:border-cobalt">
        <input
          inputMode="numeric"
          className="w-full bg-transparent text-xl font-bold text-navy outline-none placeholder:text-base placeholder:font-normal placeholder:text-[#B0B8C1]"
          placeholder={placeholder ?? "0"}
          value={value ? value.toLocaleString("ko-KR") : ""}
          onChange={(e) => onChange(parseWon(e.target.value))}
        />
        <span className="ml-2 shrink-0 text-[#8B95A1]">원</span>
      </div>
      {hint && (
        <span className="mt-1 block pl-1 text-xs font-semibold text-cobalt">{hint}</span>
      )}
    </label>
  );
}

export function SegButton<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
            value === opt.value
              ? "bg-cobalt text-white"
              : "bg-white text-[#4E5968] border border-[#E5E8EB]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
