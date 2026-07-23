import Aurora from "../reactbits/Aurora";
import SafeBoundary from "../reactbits/SafeBoundary";
import StarBorder from "../reactbits/StarBorder";
import SplitText from "../reactbits/SplitText";
import AnimatedContent from "../reactbits/AnimatedContent";

export default function CTA() {
  return (
    <section className="section cta" id="download">
      <div className="container">
        <div className="cta__panel">
          <div className="cta__aurora">
            <SafeBoundary>
              <Aurora colorStops={["#5264E8", "#A78BFA", "#8A98FF"]} amplitude={1.1} blend={0.6} speed={0.3} />
            </SafeBoundary>
            <div className="cta__aurora-fade" />
          </div>

          <div className="cta__content">
            <span className="eyebrow">지금 시작</span>
            <h2 className="display cta__title">
              <SplitText text="다음 러닝은," splitBy="words" />
              <br />
              <span className="cta__title-accent">함께.</span>
            </h2>
            <AnimatedContent direction="up" distance={20} delay={0.15}>
              <p className="lede cta__lede">
                옆 사람과 폰을 맞대는 순간, 오늘의 러닝이 함께가 됩니다.
              </p>
            </AnimatedContent>
            <AnimatedContent direction="up" distance={20} delay={0.28}>
              <div className="cta__actions">
                <StarBorder as="a" href="#top" speed="4s" className="star-border--light">
                  App Store에서 받기
                </StarBorder>
                <a
                  href="https://github.com/syncrun-labs"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  GitHub 살펴보기
                </a>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}
