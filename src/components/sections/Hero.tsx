import Aurora from "../reactbits/Aurora";
import SafeBoundary from "../reactbits/SafeBoundary";
import SplitText from "../reactbits/SplitText";
import GradientText from "../reactbits/GradientText";
import StarBorder from "../reactbits/StarBorder";
import AnimatedContent from "../reactbits/AnimatedContent";
import PhoneMock from "../ui/PhoneMock";

const CHIPS = ["UWB · 20cm", "0.4초 확정", "외부 의존성 0", "SwiftUI · Liquid Glass"];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__aurora">
        <SafeBoundary>
          <Aurora colorStops={["#6C7CFF", "#A78BFA", "#45D8FF"]} amplitude={1.0} blend={0.5} speed={0.35} />
        </SafeBoundary>
        <div className="hero__aurora-fade" />
      </div>

      <div className="hero__grid container">
        <div className="hero__copy">
          <AnimatedContent direction="up" distance={20} inView={false}>
            <span className="eyebrow">iOS · 함께 뛰는 러닝</span>
          </AnimatedContent>

          <h1 className="display hero__title">
            <SplitText text="맞대면, 그 자리에서" splitBy="words" className="hero__title-line" stagger={0.06} inView={false} />
            <span className="hero__title-line">
              함께&nbsp;<GradientText>뛴다</GradientText>
            </span>
          </h1>

          <AnimatedContent direction="up" distance={20} delay={0.15} inView={false}>
            <p className="lede hero__lede">
              옆 사람과 iPhone을 맞대면 그 순간 함께 뛸 그룹이 결성됩니다. 방 만들기도, 초대 링크도
              없이 — 함께 뛴 경로는 한 장의 러닝 카드로 남습니다.
            </p>
          </AnimatedContent>

          <AnimatedContent direction="up" distance={20} delay={0.28} inView={false}>
            <div className="hero__actions">
              <StarBorder as="a" href="#download">
                <AppleGlyph />
                App Store에서 받기
              </StarBorder>
              <a href="#how" className="btn btn-ghost">
                작동 방식 보기
              </a>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="up" distance={20} delay={0.4} inView={false}>
            <ul className="hero__chips">
              {CHIPS.map((c) => (
                <li key={c} className="hero__chip mono">
                  {c}
                </li>
              ))}
            </ul>
          </AnimatedContent>
        </div>

        <div className="hero__visual">
          <PhoneMock variant="group" />
        </div>
      </div>

      <div className="hero__scroll mono">SCROLL</div>
    </section>
  );
}

function AppleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.8 2.29-4.14 2.39-4.2-1.3-1.9-3.33-2.16-4.05-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.77-1.95 3.39-.5 8.4 1.4 11.15.93 1.35 2.03 2.86 3.48 2.8 1.4-.06 1.92-.9 3.61-.9 1.68 0 2.16.9 3.64.87 1.5-.02 2.45-1.37 3.37-2.72 1.06-1.56 1.5-3.07 1.52-3.15-.03-.01-2.92-1.12-2.95-4.44zM14.28 3.79c.77-.93 1.29-2.22 1.15-3.51-1.11.04-2.46.74-3.25 1.67-.71.82-1.33 2.14-1.16 3.4 1.24.1 2.5-.63 3.26-1.56z" />
    </svg>
  );
}
