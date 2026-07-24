/** SyncRun 브랜드 마크 — 겹친 두 '맞댐' 원(코랄). 로고 지오메트리를 SVG로. */
export default function BrandMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="26" cy="39" r="18" fill="var(--accent-core)" />
      <circle cx="43" cy="23" r="11.5" fill="var(--accent-core)" opacity="0.6" />
    </svg>
  );
}
