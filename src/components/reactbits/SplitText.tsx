import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * SplitText — React Bits 계열. 텍스트를 단어/글자로 쪼개 진입 시 아래에서 떠오른다.
 * 리빌은 결정론적 CSS 애니메이션(per-word animation-delay)으로 돌린다 —
 * 어느 조각도 숨은 채로 남지 않는다. 진입 감지는 IntersectionObserver.
 * inView=false면 마운트 즉시 재생(above-the-fold용).
 * 의미 태그(h1/h2)는 바깥에서 감싸고, 이 컴포넌트는 inline 컨테이너만 담당한다.
 */

type SplitTextProps = {
  text: string;
  className?: string;
  splitBy?: "words" | "chars";
  delay?: number;
  stagger?: number;
  once?: boolean;
  inView?: boolean;
};

export default function SplitText({
  text,
  className,
  splitBy = "words",
  delay = 0,
  stagger = 0.045,
  once = true,
  inView = true,
}: SplitTextProps) {
  const skip = useMemo(shouldSkipReveal, []);
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(!inView);

  useEffect(() => {
    if (skip || !inView) {
      setActive(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            if (once) io.disconnect();
          } else if (!once) {
            setActive(false);
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [skip, inView, once]);

  if (skip) {
    return (
      <span className={className} style={{ display: "inline-block" }}>
        {text}
      </span>
    );
  }

  const units = splitBy === "chars" ? Array.from(text) : text.split(" ");

  // 단어 사이에는 실제 공백 텍스트 노드를 둔다 — 이게 줄바꿈 기회가 되어
  // 좁은 화면에서 히어로 헤드라인이 자연스럽게 접힌다.
  const nodes: ReactNode[] = [];
  units.forEach((unit, i) => {
    nodes.push(
      <span
        key={`w${i}`}
        aria-hidden="true"
        className={`sr-split-word${active ? " is-in" : ""}`}
        style={{ animationDelay: `${delay + i * stagger}s` }}
      >
        {unit}
      </span>
    );
    if (splitBy === "words" && i < units.length - 1) nodes.push(" ");
  });

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      {nodes}
    </span>
  );
}
