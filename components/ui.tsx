"use client";

// 계산기들끼리 공유하는 작은 UI 부품 모음 (복비 계산기용으로 만들었던 걸
// 일할계산기에서도 그대로 재사용하기 위해 분리함).

export function parseWon(raw: string): number {
  const n = Number(raw.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
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
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#4E5968]">{label}</span>
      <div className="flex items-center rounded-xl border border-[#E5E8EB] bg-white px-4 py-3 focus-within:border-cobalt">
        <input
          inputMode="numeric"
          className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-[#B0B8C1]"
          placeholder={placeholder ?? "0"}
          value={value ? value.toLocaleString("ko-KR") : ""}
          onChange={(e) => onChange(parseWon(e.target.value))}
        />
        <span className="ml-2 shrink-0 text-[#8B95A1]">원</span>
      </div>
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
