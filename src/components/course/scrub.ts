/** 패널 → 그 패널의 영상 스크러버. 코스의 프레임 루프가 패널마다 `--lp`를 넘긴다. */
export const scrubbers = new WeakMap<HTMLElement, (lp: number) => void>();
