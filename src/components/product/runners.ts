import type { CSSProperties } from "react";

/** 러너 팔레트. 번호와 항목 앞의 짧은 바에 차례로 쓴다. */
export const RUNNERS = ["var(--runner-0)", "var(--runner-1)", "var(--runner-3)", "var(--runner-7)"];

/** 짧은 바의 색을 CSS 변수 `--bar`로 넘긴다. */
export const barStyle = (i: number) => ({ "--bar": RUNNERS[i % RUNNERS.length] }) as CSSProperties;
