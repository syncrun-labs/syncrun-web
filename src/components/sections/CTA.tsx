import Aurora from "../reactbits/Aurora";
import SafeBoundary from "../reactbits/SafeBoundary";
import StarBorder from "../reactbits/StarBorder";
import SplitText from "../reactbits/SplitText";
import AnimatedContent from "../reactbits/AnimatedContent";
import { useLang } from "../../i18n/lang";

export default function CTA() {
  const { t } = useLang();
  const c = t.cta;

  return (
    <section className="section cta snap-chapter" id="download">
      <div className="container">
        <div className="cta__panel">
          <div className="cta__aurora">
            <SafeBoundary>
              <Aurora colorStops={["#FF6B70", "#DC565B", "#7E2528"]} amplitude={1.1} blend={0.6} speed={0.3} />
            </SafeBoundary>
            <div className="cta__aurora-fade" />
          </div>

          <div className="cta__content">
            <h2 className="display cta__title">
              <SplitText text={c.titleTop} splitBy="words" />
              <br />
              <span className="cta__title-accent">{c.titleAccent}</span>
            </h2>
            <AnimatedContent direction="up" distance={20} delay={0.15}>
              <p className="lede cta__lede">{c.lede}</p>
            </AnimatedContent>
            <AnimatedContent direction="up" distance={20} delay={0.28}>
              <div className="cta__actions">
                <StarBorder as="a" href="#top" speed="4s" color="#FF8A8E" className="star-border--light">
                  {c.ctaPrimary}
                </StarBorder>
                <a href="https://github.com/syncrun-labs" target="_blank" rel="noreferrer" className="btn btn-ghost">
                  {c.ctaSecondary}
                </a>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}
