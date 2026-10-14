import type { AudienceSegment, Locale, Platform, Tier } from "../api/types";

type CrewFilter = NonNullable<AudienceSegment["crew"]>;

const PLATFORMS: { value: Platform | undefined; label: string }[] = [
  { value: undefined, label: "전체" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
];
const TIERS: { value: Tier; label: string }[] = [
  { value: "free", label: "무료" },
  { value: "plus", label: "Plus" },
  { value: "crew", label: "Crew" },
];
const CREWS: { value: CrewFilter | undefined; label: string }[] = [
  { value: undefined, label: "상관없음" },
  { value: "member", label: "크루 있음" },
  { value: "leader", label: "크루장" },
  { value: "none", label: "크루 없음" },
];
const LOCALES: { value: Locale | undefined; label: string }[] = [
  { value: undefined, label: "전체" },
  { value: "ko", label: "한국어" },
  { value: "en", label: "영어" },
];

type RunMode = "any" | "within" | "none";

function runMode(segment: AudienceSegment): RunMode {
  if (!segment.lastRun) return "any";
  return "withinDays" in segment.lastRun ? "within" : "none";
}

function runDays(segment: AudienceSegment): number {
  if (!segment.lastRun) return 14;
  return "withinDays" in segment.lastRun ? segment.lastRun.withinDays : segment.lastRun.noneWithinDays;
}

/** 조건 편집기 — 고른 조건은 모두 겹친다(AND). 아무것도 안 고르면 전체다. */
export function SegmentEditor({
  value,
  onChange,
}: {
  value: AudienceSegment;
  onChange: (next: AudienceSegment) => void;
}) {
  const patch = (next: Partial<AudienceSegment>) => {
    const merged: AudienceSegment = { ...value, ...next };
    for (const key of Object.keys(merged) as (keyof AudienceSegment)[]) {
      const v = merged[key];
      if (v === undefined || (Array.isArray(v) && v.length === 0) || v === "") delete merged[key];
    }
    onChange(merged);
  };

  const toggleTier = (tier: Tier) => {
    const tiers = value.tiers ?? [];
    patch({ tiers: tiers.includes(tier) ? tiers.filter((t) => t !== tier) : [...tiers, tier] });
  };

  const setRun = (mode: RunMode, days = runDays(value)) => {
    const safe = Math.min(365, Math.max(1, Math.round(days) || 1));
    patch({
      lastRun: mode === "any" ? undefined : mode === "within" ? { withinDays: safe } : { noneWithinDays: safe },
    });
  };

  const mode = runMode(value);

  return (
    <div className="segment">
      <Field label="플랫폼">
        {PLATFORMS.map((o) => (
          <Chip key={o.label} on={value.platform === o.value} onClick={() => patch({ platform: o.value })}>
            {o.label}
          </Chip>
        ))}
      </Field>
      <Field label="플랜" hint="여럿 고를 수 있어요. 안 고르면 전체">
        {TIERS.map((o) => (
          <Chip key={o.value} on={value.tiers?.includes(o.value) ?? false} onClick={() => toggleTier(o.value)}>
            {o.label}
          </Chip>
        ))}
      </Field>
      <Field label="크루">
        {CREWS.map((o) => (
          <Chip key={o.label} on={value.crew === o.value} onClick={() => patch({ crew: o.value })}>
            {o.label}
          </Chip>
        ))}
      </Field>
      <Field label="최근 러닝">
        <Chip on={mode === "any"} onClick={() => setRun("any")}>
          상관없음
        </Chip>
        <Chip on={mode === "within"} onClick={() => setRun("within")}>
          뛴 사람
        </Chip>
        <Chip on={mode === "none"} onClick={() => setRun("none")}>
          안 뛴 사람
        </Chip>
        {mode !== "any" && (
          <label className="inline-number">
            최근
            <input
              type="number"
              min={1}
              max={365}
              value={runDays(value)}
              onChange={(e) => setRun(mode, Number(e.target.value))}
            />
            일
          </label>
        )}
      </Field>
      <Field label="가입일">
        <input
          type="date"
          className="input-inline"
          aria-label="가입일 시작"
          value={value.signedUpFrom?.slice(0, 10) ?? ""}
          onChange={(e) => patch({ signedUpFrom: e.target.value ? `${e.target.value}T00:00:00+09:00` : undefined })}
        />
        <span className="dash">~</span>
        <input
          type="date"
          className="input-inline"
          aria-label="가입일 끝"
          value={value.signedUpTo?.slice(0, 10) ?? ""}
          onChange={(e) => patch({ signedUpTo: e.target.value ? `${e.target.value}T23:59:59+09:00` : undefined })}
        />
      </Field>
      <Field label="앱 언어">
        {LOCALES.map((o) => (
          <Chip key={o.label} on={value.locale === o.value} onClick={() => patch({ locale: o.value })}>
            {o.label}
          </Chip>
        ))}
      </Field>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="segment-field" role="group" aria-label={label}>
      <span className="segment-label">
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <div className="segment-options">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="chip" aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}
