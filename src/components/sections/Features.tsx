import SpotlightCard from "../reactbits/SpotlightCard";
import AnimatedContent from "../reactbits/AnimatedContent";
import type { CSSProperties } from "react";

const FEATURES = [
  {
    tag: "기록",
    title: "실측 러닝 지표",
    body: "CoreLocation 거리·페이스·고도에 케이던스까지, 추정 없이 실제로 측정합니다.",
    accent: "var(--runner-0)",
    span: "wide",
  },
  {
    tag: "기기",
    title: "Apple Watch",
    body: "손목에서 시작하고 심박을 함께 기록합니다.",
    accent: "var(--runner-5)",
  },
  {
    tag: "화면",
    title: "라이브 액티비티 · 위젯",
    body: "잠금 화면과 다이내믹 아일랜드에서 러닝 현황을 확인합니다.",
    accent: "var(--runner-3)",
  },
  {
    tag: "연동",
    title: "HealthKit 연동",
    body: "완료한 러닝을 건강 앱으로 내보냅니다.",
    accent: "var(--runner-7)",
  },
  {
    tag: "코칭",
    title: "음성 코치",
    body: "페이스와 구간을 목소리로 짚어 줍니다.",
    accent: "var(--runner-1)",
  },
  {
    tag: "돌아보기",
    title: "경로 리플레이",
    body: "달린 길을 다시 재생하며 그날의 러닝을 돌아봅니다.",
    accent: "var(--runner-2)",
    span: "wide",
  },
];

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">더 많은 것</span>
          <h2 className="h2">러닝에 필요한 모든 것</h2>
        </div>

        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <AnimatedContent
              key={f.title}
              className={`feature-cell ${f.span === "wide" ? "feature--wide" : ""}`}
              direction="up"
              distance={32}
              delay={(i % 3) * 0.08}
            >
              <SpotlightCard className="feature">
                <span
                  className="feature__tag mono"
                  style={{ "--accent": f.accent } as CSSProperties}
                >
                  {f.tag}
                </span>
                <h3 className="feature__title">{f.title}</h3>
                <p className="feature__body">{f.body}</p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
