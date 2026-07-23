import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * AnimatedContent — React Bits 계열 스크롤 리빌 래퍼.
 * 뷰포트 진입 시 방향/거리만큼 밀려 있던 콘텐츠가 spring으로 정착한다.
 * inView=false면 스크롤이 아니라 마운트 시 애니메이션한다(above-the-fold용).
 */

type Direction = "up" | "down" | "left" | "right";

type Props = {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  delay?: number;
  once?: boolean;
  inView?: boolean;
};

const offset = (d: Direction, dist: number) => {
  switch (d) {
    case "up":
      return { y: dist };
    case "down":
      return { y: -dist };
    case "left":
      return { x: dist };
    case "right":
      return { x: -dist };
  }
};

export default function AnimatedContent({
  children,
  className,
  direction = "up",
  distance = 36,
  delay = 0,
  once = true,
  inView = true,
}: Props) {
  const skip = useMemo(shouldSkipReveal, []);
  if (skip) return <div className={className}>{children}</div>;

  const init = { opacity: 0, ...offset(direction, distance) };
  const shown = { opacity: 1, x: 0, y: 0 };
  const transition = { type: "spring" as const, stiffness: 120, damping: 20, delay };

  if (!inView) {
    return (
      <motion.div className={className} initial={init} animate={shown} transition={transition}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={init}
      whileInView={shown}
      viewport={{ once, amount: 0.25 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
