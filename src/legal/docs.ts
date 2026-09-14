/**
 * 약관 3종의 키·슬러그 목록. 라우트(`generateStaticParams`)와 화면(탭)이 같은 것을 본다.
 *
 * 슬러그는 공개 URL `/legal/<슬러그>`다 — App Store Connect의 개인정보 처리방침 URL로 등록돼
 * 심사에서 열리는 주소라 바꾸지 않는다. 배경은 `docs/adr/0001-migrate-to-nextjs.md`.
 */
export const LEGAL_DOCS = [
  { key: "terms", slug: "terms-of-service" },
  { key: "privacy", slug: "privacy-policy" },
  { key: "location", slug: "location-terms" },
] as const;

export type LegalDocKey = (typeof LEGAL_DOCS)[number]["key"];
export type LegalDocSlug = (typeof LEGAL_DOCS)[number]["slug"];

export function docBySlug(slug: string) {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
