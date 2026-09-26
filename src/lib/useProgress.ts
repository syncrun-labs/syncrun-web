import { useEffect, useRef, type RefObject } from "react";
import { shouldSkipReveal } from "./reveal";

/**
 * 섹션의 스크롤 진행도(0~1)를 요소의 CSS 변수 `--p`로 흘려보낸다.
 *
 * - `pin`: 섹션이 화면보다 길고 안의 무대가 `position: sticky`로 붙어 있다. 무대가 붙는 순간 0, 떨어지는 순간 1.
 * - `pass`: 보통 높이의 섹션. 아래 끝에서 들어올 때 0, 위 끝으로 나갈 때 1.
 *
 * 그림은 CSS가 `--p`에서 계산하고, 글자·캔버스처럼 CSS로 못 그리는 것만 `onFrame`이 직접 고친다 —
 * React는 스크롤마다 다시 렌더하지 않는다. 입력은 rAF 에서 읽어 지수 감쇠시키고, 화면 밖에서는 멈춘다.
 * 축소 모션·`?reveal=all`에서는 처음부터 1이다(완성된 모습).
 */

export type ProgressMode = "pin" | "pass";

const TAU = 0.08;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function useProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  mode: ProgressMode,
  onFrame?: (p: number) => void,
): void {
  // 콜백이 바뀌어도 루프를 다시 세우지 않는다
  const cb = useRef(onFrame);
  useEffect(() => {
    cb.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (p: number) => {
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p);
    };
    if (shouldSkipReveal()) {
      write(1);
      return;
    }

    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (mode === "pin") {
        const run = r.height - vh;
        return run > 0 ? clamp01(-r.top / run) : r.top <= 0 ? 1 : 0;
      }
      return clamp01((vh - r.top) / (vh + r.height));
    };

    let current = target();
    write(current);
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      const goal = target();
      current = Math.abs(goal - current) > 0.3 ? goal : current + (goal - current) * (1 - Math.exp(-dt / TAU));
      if (Math.abs(goal - current) < 0.0005) current = goal;
      write(current);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        last = 0;
        if (e.isIntersecting) raf = requestAnimationFrame(tick);
        else write((current = target()));
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, mode]);
}

export const span = (p: number, a: number, d: number) => clamp01((p - a) / d);
