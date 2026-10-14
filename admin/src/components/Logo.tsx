/** 두 경로가 만나는 마크 — 앱 아이콘의 단순형. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="SyncRun" role="img">
      <rect width="32" height="32" rx="9" fill="var(--primary-fill)" />
      <path
        d="M8 21c3-8 6-10 8-10s5 2 8 10"
        fill="none"
        stroke="var(--on-primary)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="11" r="2.6" fill="var(--accent-core)" />
    </svg>
  );
}
