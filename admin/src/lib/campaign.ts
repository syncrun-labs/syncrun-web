import type { AudienceSegment, CampaignInput, PushDestination } from "../api/types";
import { countChars } from "./format";

export const TITLE_MAX = 40;
export const BODY_MAX = 120;

export interface ComposeForm {
  titleKo: string;
  bodyKo: string;
  titleEn: string;
  bodyEn: string;
  destination: PushDestination;
  url: string;
  segment: AudienceSegment;
}

export const EMPTY_FORM: ComposeForm = {
  titleKo: "",
  bodyKo: "",
  titleEn: "",
  bodyEn: "",
  destination: "home",
  url: "",
  segment: {},
};

export const DESTINATIONS: { value: PushDestination; label: string }[] = [
  { value: "home", label: "홈" },
  { value: "notices", label: "공지와 약관" },
  { value: "crew", label: "내 크루" },
  { value: "url", label: "웹 페이지" },
];

export type FormErrors = Partial<Record<keyof ComposeForm, string>>;

/** https 이고 호스트가 syncrunlabs.com 이거나 그 서브도메인인 주소만 받는다(계약 §4.7.1). */
export function isAllowedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" && (url.hostname === "syncrunlabs.com" || url.hostname.endsWith(".syncrunlabs.com"))
    );
  } catch {
    return false;
  }
}

function checkText(value: string, max: number, label: string): string | undefined {
  const n = countChars(value.trim());
  if (n === 0) return `${label}을 적어 주세요`;
  if (n > max) return `${max}자까지예요`;
  return undefined;
}

export function validate(form: ComposeForm): FormErrors {
  const errors: FormErrors = {};
  const set = (key: keyof ComposeForm, message: string | undefined) => {
    if (message) errors[key] = message;
  };
  set("titleKo", checkText(form.titleKo, TITLE_MAX, "제목"));
  set("bodyKo", checkText(form.bodyKo, BODY_MAX, "본문"));
  set("titleEn", checkText(form.titleEn, TITLE_MAX, "영어 제목"));
  set("bodyEn", checkText(form.bodyEn, BODY_MAX, "영어 본문"));
  if (form.destination === "url" && !isAllowedUrl(form.url.trim())) {
    errors.url = "https://로 시작하는 syncrunlabs.com 주소만 돼요";
  }
  return errors;
}

const TIER_LABEL = { free: "무료", plus: "Plus", crew: "Crew" } as const;
const CREW_LABEL = { member: "크루 있음", leader: "크루장", none: "크루 없음" } as const;

/** 대상 조건을 사람이 읽는 한 줄로. 빈 조건은 「모든 이용자」. */
export function describeSegment(segment: AudienceSegment): string {
  const parts: string[] = [];
  if (segment.userIds?.length) parts.push(`지정한 ${segment.userIds.length}명`);
  if (segment.platform) parts.push(segment.platform === "ios" ? "iOS" : "Android");
  if (segment.tiers?.length) parts.push(segment.tiers.map((t) => TIER_LABEL[t]).join(" · "));
  if (segment.crew) parts.push(CREW_LABEL[segment.crew]);
  if (segment.lastRun) {
    parts.push(
      "withinDays" in segment.lastRun
        ? `최근 ${segment.lastRun.withinDays}일 안에 뛴 사람`
        : `최근 ${segment.lastRun.noneWithinDays}일 동안 안 뛴 사람`,
    );
  }
  if (segment.signedUpFrom || segment.signedUpTo) {
    parts.push(`가입 ${segment.signedUpFrom?.slice(0, 10) ?? ""}~${segment.signedUpTo?.slice(0, 10) ?? ""}`);
  }
  if (segment.locale) parts.push(segment.locale === "ko" ? "한국어 앱" : "영어 앱");
  return parts.length > 0 ? parts.join(", ") : "모든 이용자";
}

export function toInput(form: ComposeForm): CampaignInput {
  return {
    type: "notice",
    titleKo: form.titleKo.trim(),
    bodyKo: form.bodyKo.trim(),
    titleEn: form.titleEn.trim(),
    bodyEn: form.bodyEn.trim(),
    destination: form.destination,
    ...(form.destination === "url" ? { url: form.url.trim() } : {}),
    segment: form.segment,
  };
}
