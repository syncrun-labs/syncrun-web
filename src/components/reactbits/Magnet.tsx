import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

/**
 * Magnet — React Bits 계열. 커서가 가까워지면 요소가 자석처럼 커서 쪽으로 끌려간다.
 * 벗어나면 spring으로 제자리 복귀.
 */

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
};

export default function Magnet({ children, className, strength = 0.35, radius = 120 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      setPos({ x: dx * strength, y: dy * strength });
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.6 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
