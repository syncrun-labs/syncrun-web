import { motion } from "framer-motion";

/**
 * LiveMap — 함께 뛰는 동안 서로의 위치·페이스가 실시간으로 흐르는 앰비언트 지도.
 * 러너 점들이 경로를 따라(샘플 좌표 키프레임) 천천히 왕복 이동한다.
 */

const PATH = "M30,210 C80,120 140,180 190,110 C230,55 300,90 330,50";

// PATH를 따라 샘플링한 좌표 — offset-path 미지원 브라우저에서도 안정적으로 움직인다.
const POINTS: Array<[number, number]> = [
  [30, 210],
  [72, 158],
  [112, 168],
  [150, 138],
  [190, 110],
  [238, 72],
  [290, 80],
  [330, 50],
];

const RUNNERS = [
  { color: "var(--runner-0)", dur: 9, delay: 0 },
  { color: "var(--runner-1)", dur: 9.6, delay: 0.7 },
  { color: "var(--runner-2)", dur: 10.2, delay: 1.3 },
];

export default function LiveMap() {
  const xs = POINTS.map((p) => p[0]);
  const ys = POINTS.map((p) => p[1]);

  return (
    <div className="livemap glass">
      <div className="livemap__badge">
        <span className="livemap__pulse" />
        <span className="mono">LIVE · 실시간</span>
      </div>

      <svg className="livemap__canvas" viewBox="0 0 360 240" fill="none" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 48} x2="360" y2={i * 48} stroke="rgba(17,18,28,0.055)" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 48} y1="0" x2={i * 48} y2="240" stroke="rgba(17,18,28,0.055)" />
        ))}
        <path d={PATH} stroke="rgba(17,18,28,0.16)" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" />
        {RUNNERS.map((r, i) => (
          <motion.circle
            key={i}
            r="7"
            cx={xs[0]}
            cy={ys[0]}
            fill={r.color}
            style={{ filter: "drop-shadow(0 2px 5px rgba(30,40,90,0.25))" }}
            animate={{ cx: xs, cy: ys }}
            transition={{
              duration: r.dur,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: r.delay,
            }}
          />
        ))}
      </svg>

      <div className="livemap__rows">
        {[
          { name: "나", color: "var(--runner-0)", pace: "5’31”", dist: "3.1" },
          { name: "지민", color: "var(--runner-1)", pace: "5’44”", dist: "3.0" },
          { name: "현우", color: "var(--runner-2)", pace: "5’52”", dist: "2.9" },
        ].map((r) => (
          <div key={r.name} className="livemap__row">
            <span className="livemap__dot" style={{ background: r.color }} />
            <span className="livemap__name">{r.name}</span>
            <span className="livemap__pace tabular mono">{r.pace}</span>
            <span className="livemap__dist tabular mono">{r.dist} km</span>
          </div>
        ))}
      </div>
    </div>
  );
}
