import { motion } from "framer-motion";

/**
 * RouteArt — 함께 뛴 경로가 겹쳐 한 장의 작품이 되는 러닝 카드.
 * 러너 팔레트 색의 경로 세 갈래가 뷰포트 진입 시 그려진다(pathLength 0→1).
 */

const PATHS = [
  { d: "M40,240 C70,150 120,200 150,120 C175,55 240,80 250,150 C258,205 300,180 320,110", color: "var(--runner-0)" },
  { d: "M55,250 C95,180 130,230 175,160 C210,105 255,140 275,95 C288,66 315,120 330,150", color: "var(--runner-1)" },
  { d: "M40,235 C90,215 110,150 165,180 C215,207 235,120 285,140 C315,152 305,200 330,175", color: "var(--runner-3)" },
];

export default function RouteArt() {
  return (
    <div className="routeart glass">
      <div className="routeart__head">
        <div>
          <span className="routeart__label mono">SYNCRUN · 그룹 카드</span>
          <h4 className="routeart__title">한강 야간 러닝</h4>
        </div>
        <span className="routeart__date mono">7월 22일 · 목</span>
      </div>

      <svg className="routeart__canvas" viewBox="0 0 360 300" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="ra-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgba(82,100,232,0.22)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="360" height="300" fill="url(#ra-glow)" />
        {/* subtle grid */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="360" y2={i * 50} stroke="rgba(17,18,28,0.05)" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="300" stroke="rgba(17,18,28,0.05)" />
        ))}
        {PATHS.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            stroke={p.color}
            strokeWidth={3.5}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 2px 5px rgba(30,40,90,0.18))" }}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.25, ease: "easeInOut" }}
          />
        ))}
        {/* start / end nodes */}
        <circle cx="40" cy="240" r="5" fill="var(--runner-0)" />
        <circle cx="330" cy="150" r="5.5" fill="var(--ink)" />
        <circle cx="330" cy="150" r="10" fill="none" stroke="var(--ink)" strokeOpacity="0.2" strokeWidth="1.5" />
      </svg>

      <div className="routeart__stats">
        {[
          { k: "거리", v: "8.42", u: "km" },
          { k: "페이스", v: "5’38”", u: "/km" },
          { k: "함께", v: "3", u: "명" },
        ].map((s) => (
          <div key={s.k} className="routeart__stat">
            <span className="routeart__stat-k mono">{s.k}</span>
            <span className="routeart__stat-v tabular">
              {s.v}
              <em>{s.u}</em>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
