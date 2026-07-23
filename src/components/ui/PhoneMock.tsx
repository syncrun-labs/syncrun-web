import { useMemo } from "react";
import { motion } from "framer-motion";
import { shouldSkipReveal } from "../../lib/reveal";

/**
 * PhoneMock — syncrun-ios 홈 화면(Start Hub)을 브라우저에 재현한다.
 * 긴 단색 Start 캡슐 + 결성 인원 캡슐(겹친 아바타·준비 체크) + 글래스 하단 독.
 * "하나의 Start" 원칙을 그대로 보여주는 히어로 오브젝트.
 */

type Runner = { name: string; color: string; ready?: boolean; me?: boolean };

const GROUP: Runner[] = [
  { name: "나", color: "var(--runner-0)", me: true },
  { name: "지민", color: "var(--runner-1)", ready: true },
  { name: "현우", color: "var(--runner-2)", ready: true },
  { name: "서연", color: "var(--runner-3)" },
];

export default function PhoneMock({
  variant = "group",
  float = true,
}: {
  variant?: "group" | "solo";
  float?: boolean;
}) {
  const runners = variant === "group" ? GROUP : [GROUP[0]];
  const title = variant === "group" ? "함께 시작" : "시작";
  const skip = useMemo(shouldSkipReveal, []);

  return (
    <motion.div
      className="phone"
      initial={skip ? false : { opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      style={float ? { animation: "float 7s ease-in-out infinite" } : undefined}
    >
      <div className="phone__frame">
        {/* dynamic island */}
        <div className="phone__island" />

        <div className="phone__screen">
          {/* top bar */}
          <div className="phone__topbar">
            <span className="phone__brand">SyncRun</span>
            <span className="phone__help">?</span>
          </div>

          {/* ambient ripple center */}
          <div className="phone__stage">
            <div className="phone__ripple" />
            <div className="phone__ripple phone__ripple--2" />
          </div>

          {/* participant capsule */}
          <div className="phone__capsule glass">
            <div className="phone__avatars">
              {runners.map((r, i) => (
                <div key={i} className="phone__avatar" style={{ background: r.color, zIndex: 10 - i }}>
                  {r.me ? "나" : r.name.slice(0, 1)}
                  {r.ready && <span className="phone__check">✓</span>}
                </div>
              ))}
            </div>
            {variant === "group" ? (
              <span className="phone__capsule-label">{runners.length}명 연결됨</span>
            ) : (
              <span className="phone__capsule-label">목표 · 5.00 km</span>
            )}
          </div>

          {/* start button */}
          <button className="phone__start" tabIndex={-1}>
            {title}
          </button>
          <span className="phone__goal">5.00 km · {variant === "group" ? "함께" : "혼자"}</span>

          {/* bottom dock */}
          <div className="phone__dock glass">
            {["run", "activity", "me"].map((k, i) => (
              <span key={k} className={`phone__tab ${i === 0 ? "is-active" : ""}`}>
                <i />
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
