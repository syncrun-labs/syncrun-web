/** 공개 페이지 목록 — 언어 접두 없는 형태. 시각 회귀와 URL 계약 테스트가 함께 쓴다. */
export const PAGES = [
  { name: "landing", path: "/" },
  { name: "support", path: "/support" },
  { name: "company", path: "/company" },
  { name: "legal-terms", path: "/legal/terms-of-service" },
  { name: "legal-privacy", path: "/legal/privacy-policy" },
  { name: "legal-location", path: "/legal/location-terms" },
] as const;

export type Lang = "ko" | "en";

/** 언어는 URL이 정한다 — ko는 접두 없음, en은 `/en`. 프로젝트 이름(`desktop-ko` 등)에서 언어를 읽는다. */
export function localized(path: string, lang: Lang): string {
  if (lang === "ko") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function langOf(projectName: string): Lang {
  return projectName.endsWith("-en") ? "en" : "ko";
}

/**
 * App Store Connect에 등록돼 심사에서 열리는 약관 주소 — `syncrun-ios`가 `enum LegalLinks`로
 * 정식 주소로 선언해 둔 값이기도 하다. 경로와 문서의 짝을 고정으로 지킨다.
 * 자세한 배경은 `docs/adr/0001-migrate-to-nextjs.md`.
 *
 * 본문은 번역하지 않으므로(한국어가 정본) 제목은 화면 언어와 무관하게 같다.
 */
export const LEGAL_CONTRACT = [
  { path: "/legal/terms-of-service", heading: "싱크런(SyncRun) 서비스 이용약관" },
  { path: "/legal/privacy-policy", heading: "싱크런(SyncRun) 개인정보 처리방침" },
  { path: "/legal/location-terms", heading: "싱크런(SyncRun) 위치기반서비스 이용약관" },
] as const;

/**
 * App Store Connect 메타데이터에 거는 주소. 한국어 스토어는 `/`(Marketing)·`/support`(Support),
 * 영어 스토어는 `/en`·`/en/support`. 등록되는 순간 약관 URL과 같은 급의 계약이 된다.
 */
export const STORE_URLS = ["/", "/support", "/en", "/en/support"] as const;
