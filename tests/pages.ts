/** 공개 페이지 목록 — 시각 회귀와 URL 계약 테스트가 함께 쓴다. */
export const PAGES = [
  { name: "landing", path: "/" },
  { name: "support", path: "/support" },
  { name: "company", path: "/company" },
  { name: "legal-terms", path: "/legal/terms-of-service" },
  { name: "legal-privacy", path: "/legal/privacy-policy" },
  { name: "legal-location", path: "/legal/location-terms" },
] as const;

/**
 * 출시된 iOS 앱과 App Store Connect가 참조하는 약관 주소 — `syncrun-ios`의 `enum LegalLinks`.
 * 앱은 되돌릴 수 없으므로 이 경로와 문서의 짝은 고정이다. 자세한 배경은 `docs/adr/0001-migrate-to-nextjs.md`.
 *
 * 본문은 번역하지 않으므로(한국어가 정본) 제목은 화면 언어와 무관하게 같다.
 */
export const LEGAL_CONTRACT = [
  { path: "/legal/terms-of-service", heading: "싱크런(SyncRun) 서비스 이용약관" },
  { path: "/legal/privacy-policy", heading: "싱크런(SyncRun) 개인정보 처리방침" },
  { path: "/legal/location-terms", heading: "싱크런(SyncRun) 위치기반서비스 이용약관" },
] as const;
