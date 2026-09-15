import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
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
  enter = true,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  /** 표시 폭. 숫자면 px 상한(78vw까지 줄어든다), 문자열이면 CSS 길이 그대로. */
  width?: number | string;
  tilt?: boolean;
  float?: boolean;
  glow?: "accent" | "cool" | "none";
  priority?: boolean;
  /** false면 자체 등장 없이 바로 보인다 — 바깥 요소가 등장을 맡을 때. */
  enter?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const skip = shouldSkipReveal() || !enter;
  const active = tilt && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  const rotY = useTransform(smooth, [0, 0.5, 1], [13, -1.5, -15]);
  const rotX = useTransform(smooth, [0, 0.5, 1], [7, 0.5, -6]);
  const y = useTransform(smooth, [0, 1], [46, -46]);

  const style = { "--dev-w": typeof width === "number" ? `min(${width}px, 78vw)` : width } as CSSProperties;
  const sizes = typeof width === "number" ? `${width}px` : "50vw";

  return (
    <div ref={ref} className={`device device--glow-${glow} ${className}`} style={style}>
      <div className="device__halo" aria-hidden="true" />
      <motion.div
        className="device__stage"
        style={active ? { rotateY: rotY, rotateX: rotX, y } : undefined}
        // 서버는 숨긴 초기 상태를 그린다. 건너뛰거나 reduce면 `initial={false}`가 아니라 즉시 최종 상태로
        // animate 해야 한다 — false로 두면 서버가 심은 opacity:0 인라인 스타일이 그대로 남는다.
        initial={{ opacity: 0, y: 60, rotateX: 10 }}
        animate={skip || reduce ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
        whileInView={skip || reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={skip || reduce ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="device__frame"
          style={float && !reduce ? { animation: "float 8s ease-in-out infinite" } : undefined}
        >
          <div className="device__screen">
            {/* 정적 import라 크기를 알고, Vercel이 AVIF/WebP·표시 크기별로 변환해 낸다. 표시 폭은 CSS의 --dev-w 상한을 따른다. */}
            <Image src={src} alt={alt} priority={priority} sizes={sizes} draggable={false} />
            <span className="device__gloss" aria-hidden="true" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
