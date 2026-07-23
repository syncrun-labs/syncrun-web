import AnimatedContent from "../reactbits/AnimatedContent";
import ShinyText from "../reactbits/ShinyText";

const POINTS = [
  "그냥 누르면 혼자, 옆 사람과 맞대면 함께 — 같은 자리의 같은 버튼이 라벨과 색만 바꿉니다.",
  "솔로용·그룹용 화면을 따로 두지 않습니다. 하나의 Start, 하나의 러닝, 하나의 결과.",
  "어떤 상태에서도 기록은 저장 중입니다. 연결이 끊겨도 잃지 않습니다.",
];

export default function OneStart() {
  return (
    <section className="section onestart" id="onestart">
      <div className="container onestart__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="onestart__copy">
            <span className="eyebrow">하나의 Start</span>
            <h2 className="h2">
              솔로와 그룹은 모드가 아니라 <ShinyText text="상태다" className="onestart__accent" />
            </h2>
            <ul className="onestart__list">
              {POINTS.map((p) => (
                <li key={p}>
                  <span className="onestart__tick" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="onestart__demo">
            <div className="morph">
              <span className="morph__tag mono">혼자</span>
              <div className="morph__capsule glass">
                <span className="morph__avatar" style={{ background: "var(--runner-0)" }}>
                  나
                </span>
                <span className="morph__pill">시작</span>
              </div>
            </div>

            <div className="morph__arrow" aria-hidden="true">
              <span>맞댐</span>
              <svg viewBox="0 0 40 12" fill="none" stroke="var(--cobalt-bright)" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 6h32M28 2l6 4-6 4" />
              </svg>
            </div>

            <div className="morph">
              <span className="morph__tag mono">함께</span>
              <div className="morph__capsule glass morph__capsule--group">
                <span className="morph__avatars">
                  {["var(--runner-0)", "var(--runner-1)", "var(--runner-2)"].map((c, i) => (
                    <span key={i} className="morph__avatar" style={{ background: c, marginLeft: i ? -8 : 0, zIndex: 3 - i }}>
                      {i === 0 ? "나" : ""}
                    </span>
                  ))}
                </span>
                <span className="morph__pill morph__pill--group">함께 시작</span>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
