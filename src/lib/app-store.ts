import type { Lang } from "../i18n/dict";

const APP_ID = "id6803402900";

/**
 * App Store 제품 페이지. 출시(2026-09-09)로 실제 주소가 생겼다.
 * 국가 코드 없는 `/app/id…`는 웹에서 미국 스토어(`/us/`)로 넘어가므로,
 * 한국어 페이지는 한국 스토어(`/kr/`)를 연다. 영어 페이지는 방문자 지역이 여러 곳이라
 * 국가 코드 없이 둔다(iPhone에서는 App Store 앱이 기기 지역으로 연다).
 */
export function appStoreUrl(lang: Lang): string {
  return lang === "ko" ? `https://apps.apple.com/kr/app/${APP_ID}` : `https://apps.apple.com/app/${APP_ID}`;
}
