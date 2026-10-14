const SEOUL = "Asia/Seoul";

/** 2026.08.01 — 한국 시간 기준 날짜. */
export function formatDate(iso: string): string {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}

/** 10월 20일 (월) 10:00 — 한국 시간 기준 일시. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: SEOUL,
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** `<input type="datetime-local">` 값(한국 시간)을 UTC ISO로. 서울은 서머타임이 없어 +09:00 고정이다. */
export function seoulLocalToIso(local: string): string {
  return new Date(`${local}:00+09:00`).toISOString();
}

/** 지금부터 minutes 뒤를 한국 시간 `datetime-local` 값으로. */
export function seoulLocalFromNow(minutes: number, now = new Date()): string {
  const shifted = new Date(now.getTime() + minutes * 60_000 + 9 * 3_600_000);
  return shifted.toISOString().slice(0, 16);
}

/** 글자 수 — 이모지 · 결합 문자를 사람이 보는 한 글자로 센다. */
export function countChars(text: string): number {
  const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
  let n = 0;
  for (const _ of segmenter.segment(text)) n++;
  return n;
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n);
}
