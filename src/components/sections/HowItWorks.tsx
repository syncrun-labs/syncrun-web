import SpotlightCard from "../reactbits/SpotlightCard";
import AnimatedContent from "../reactbits/AnimatedContent";
import SplitText from "../reactbits/SplitText";
import type { CSSProperties } from "react";

const STEPS = [
  {
    n: "01",
    title: "맞댐",
    sub: "Bump",
    accent: "var(--runner-0)",
    body: "함께 뛸 사람과 iPhone 상단을 가까이 대세요. UWB로 20cm·0.4초를 확인하면 자동으로 같은 세션에 합류합니다. 흔들기도, 충격도 필요 없습니다.",
  },
  {
    n: "02",
    title: "함께 출발",
    sub: "Ready",
    accent: "var(--runner-1)",
    body: "모두 준비되면 마지막 사람의 Start 버튼으로 같은 순간 출발합니다. 흰 화면의 3 · 2 · 1 카운트다운이 지나면 러닝이 시작됩니다.",
  },
  {
    n: "03",
    title: "러닝 카드",
    sub: "Route Art",
    accent: "var(--runner-2)",
    body: "달리기가 끝나면 함께 뛴 경로가 이미 한 장의 작품으로 완성돼 있습니다. 개인·단체 구분 없이 한 장만 남습니다.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">작동 방식</span>
          <h2 className="h2">
            <SplitText text="폰을 맞대는 순간," splitBy="words" />
            <br />
            <span className="section-head__muted">셋이 하나의 러닝이 된다</span>
          </h2>
        </div>

        <div className="how__grid">
          {STEPS.map((s, i) => (
            <AnimatedContent key={s.n} direction="up" distance={40} delay={i * 0.12}>
              <SpotlightCard className="how__card">
                <div className="how__card-head">
                  <span className="how__n" style={{ "--accent": s.accent } as CSSProperties}>
                    {s.n}
                  </span>
                  <span className="how__meta mono" style={{ color: s.accent }}>
                    {s.sub}
                  </span>
                </div>
                <h3 className="how__title">{s.title}</h3>
                <p className="how__body">{s.body}</p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
