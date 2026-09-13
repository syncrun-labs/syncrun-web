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

  const init = { opacity: 0, ...offset(direction, distance) };
  const shown = { opacity: 1, x: 0, y: 0 };
  const transition = { type: "spring" as const, stiffness: 120, damping: 20, delay };

  // 서버는 리빌 여부를 모르므로 항상 숨긴 초기 상태를 그린다. 건너뛸 때도 같은 motion.div를 유지해야
  // 하이드레이션이 서버 DOM을 그대로 채택한 뒤 framer가 스타일을 넘겨받아 즉시 최종 상태로 보낸다.
  // 일반 div로 바꾸면 React가 서버가 심은 opacity:0 인라인 스타일을 손대지 않아 내용이 영영 안 보인다.
  if (skip) {
    return (
      <motion.div className={className} initial={init} animate={shown} transition={{ duration: 0 }}>
        {children}
      </motion.div>
    );
  }

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
