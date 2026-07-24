import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { CSSProperties } from "react";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * DeviceFrame — 실제 iOS 시뮬레이터 캡처를 아이폰 베젤에 담는다.
 * 스크린샷 자체에 상태바·다이내믹 아일랜드가 들어 있어 별도 오버레이가 없다.
 * 스크롤 진행에 따라 3D로 살짝 회전(tilt)하고, 뒤에 코랄 글로우가 번진다.
 */
export default function DeviceFrame({
  src,
  alt,
  width = 300,
  tilt = true,
  float = true,
  glow = "accent",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number;
  tilt?: boolean;
  float?: boolean;
  glow?: "accent" | "cool" | "none";
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const skip = shouldSkipReveal();
  const active = tilt && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  const rotY = useTransform(smooth, [0, 0.5, 1], [13, -1.5, -15]);
  const rotX = useTransform(smooth, [0, 0.5, 1], [7, 0.5, -6]);
  const y = useTransform(smooth, [0, 1], [46, -46]);

  const style = { "--dev-w": `min(${width}px, 78vw)` } as CSSProperties;

  return (
    <div ref={ref} className={`device device--glow-${glow} ${className}`} style={style}>
      <div className="device__halo" aria-hidden="true" />
      <motion.div
        className="device__stage"
        style={active ? { rotateY: rotY, rotateX: rotX, y } : undefined}
        initial={skip || reduce ? false : { opacity: 0, y: 60, rotateX: 10 }}
        whileInView={skip || reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="device__frame" style={float && !reduce ? { animation: "float 8s ease-in-out infinite" } : undefined}>
          <div className="device__screen">
            <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} draggable={false} />
            <span className="device__gloss" aria-hidden="true" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
