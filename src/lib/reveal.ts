/**
 * 스크롤 리빌 게이팅을 건너뛸지 판단한다.
 * - prefers-reduced-motion: 모션을 줄이려는 사용자에게는 IntersectionObserver를 기다리지 않고
 *   콘텐츠를 즉시 최종 상태로 보여준다(접근성 + 견고성).
 * - ?reveal=all: 정적 QA/스크린샷용으로 모든 리빌을 즉시 표시한다.
 */
export function shouldSkipReveal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    if (new URLSearchParams(window.location.search).get("reveal") === "all") return true;
  } catch {
    return false;
  }
  return false;
}
