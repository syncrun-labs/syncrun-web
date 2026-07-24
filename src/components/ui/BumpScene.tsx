import { motion, useReducedMotion } from "framer-motion";

/**
 * BumpScene — 두 iPhone이 상단을 맞대는 순간을 재현한다.
 * 접점에서 UWB 리플이 번지고 코랄 스파크가 튄다. 다크 섹션 전용.
 * 화면은 실제 홈(Start Hub) 캡처를 쓴다.
 */
const HOME = `${import.meta.env.BASE_URL}shots/home.png`;

export default function BumpScene() {
  const reduce = useReducedMotion();
  const sway = reduce
    ? {}
    : { animate: { x: [0, 6, 0], y: [0, -3, 0] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } };
  const swayR = reduce
    ? {}
    : { animate: { x: [0, -6, 0], y: [0, -3, 0] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } };

  return (
    <div className="bump-scene" role="img" aria-label="Two iPhones touching to form a running group">
      <motion.div className="bump-scene__phone bump-scene__phone--l" {...sway}>
        <div className="bump-scene__frame">
          <img src={HOME} alt="" loading="lazy" draggable={false} />
        </div>
      </motion.div>

      <div className="bump-scene__contact" aria-hidden="true">
        <span className="bump-scene__ripple" />
        <span className="bump-scene__ripple bump-scene__ripple--2" />
        <span className="bump-scene__ripple bump-scene__ripple--3" />
        <span className="bump-scene__spark" />
      </div>

      <motion.div className="bump-scene__phone bump-scene__phone--r" {...swayR}>
        <div className="bump-scene__frame">
          <img src={HOME} alt="" loading="lazy" draggable={false} />
        </div>
      </motion.div>
    </div>
  );
}
