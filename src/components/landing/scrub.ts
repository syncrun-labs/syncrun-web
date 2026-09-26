/** 호스트 요소(`[data-scrub-host]`) → 그 안의 영상 스크러버. 호스트의 진행도 루프가 값을 넘긴다. */
export const scrubbers = new WeakMap<HTMLElement, (p: number) => void>();
