import { useEffect, useRef, type ReactNode } from "react";

/**
 * ClickSpark — React Bits 계열. 클릭한 자리에서 짧은 빛줄기들이 방사형으로 튀며 사라진다.
 * 캔버스 오버레이라 클릭을 가로채지 않는다(pointer-events: none). 맞댐의 촉감을 웹에서 흉내.
 */

type Props = {
  children: ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkSize?: number;
  sparkRadius?: number;
  duration?: number;
};

type Spark = { x: number; y: number; angle: number; start: number };

export default function ClickSpark({
  children,
  sparkColor = "#8A98FF",
  sparkCount = 9,
  sparkSize = 11,
  sparkRadius = 26,
  duration = 420,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      if (reduce) return;
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / sparkCount,
          start: now,
        });
      }
    };
    window.addEventListener("click", onClick);

    let raf = 0;
    const ease = (t: number) => t * (2 - t);
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.current = sparks.current.filter((s) => now - s.start < duration);
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (const s of sparks.current) {
        const p = ease((now - s.start) / duration);
        const dist = p * sparkRadius;
        const len = sparkSize * (1 - p);
        const x1 = s.x + dist * Math.cos(s.angle);
        const y1 = s.y + dist * Math.sin(s.angle);
        const x2 = s.x + (dist + len) * Math.cos(s.angle);
        const y2 = s.y + (dist + len) * Math.sin(s.angle);
        ctx.globalAlpha = 1 - p;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
    };
  }, [sparkColor, sparkCount, sparkSize, sparkRadius, duration]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
      {children}
    </>
  );
}
