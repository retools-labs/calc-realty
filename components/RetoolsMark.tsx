// apple-realty-settlement의 src/components/RetoolsMark.tsx와 동일한 컴포넌트.
export default function RetoolsMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Retools">
      <defs>
        <linearGradient id="retools-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0b1830" />
          <stop offset="1" stopColor="#173a63" />
        </linearGradient>
        <linearGradient id="retools-border" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <filter id="retools-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#retools-bg)" stroke="url(#retools-border)" strokeWidth="2.5" filter="url(#retools-glow)" />
      <text x="32" y="43" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="30" fill="#ffffff">
        R
      </text>
    </svg>
  );
}
