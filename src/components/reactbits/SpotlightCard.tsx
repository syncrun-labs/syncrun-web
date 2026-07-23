import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";

/**
 * SpotlightCard — React Bits 계열. 커서를 따라 코발트 스포트라이트가 글래스 표면 위를 비춘다.
 * CSS 변수(--mx/--my)로 위치를 넘기고 ::after 라디얼이 밝아진다.
 */

type Props = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(82, 100, 232, 0.16)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`spotlight-card glass ${className}`}
      style={{ "--spotlight": spotlightColor } as CSSProperties}
    >
      {children}
    </div>
  );
}
