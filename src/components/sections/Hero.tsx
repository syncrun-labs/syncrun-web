import SplitText from "../reactbits/SplitText";
import GradientText from "../reactbits/GradientText";
import StarBorder from "../reactbits/StarBorder";
import AnimatedContent from "../reactbits/AnimatedContent";
import DeviceFrame from "../ui/DeviceFrame";
import { useLang } from "../../i18n/lang";

const HOME = `${import.meta.env.BASE_URL}shots/home.png`;

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero snap-chapter" id="top">
      <div className="hero__grid container">
        <div className="hero__copy">
          <h1 className="display hero__title">
            <SplitText text={t.hero.titleTop} splitBy="words" className="hero__title-line" stagger={0.06} inView={false} />
            <span className="hero__title-line">
              <GradientText colors={["#DC565B", "#FF8A8E", "#DC565B"]}>{t.hero.titleAccent}</GradientText>
            </span>
          </h1>

          <AnimatedContent direction="up" distance={20} delay={0.15} inView={false}>
            <p className="lede hero__lede">{t.hero.lede}</p>
          </AnimatedContent>

          <AnimatedContent direction="up" distance={20} delay={0.28} inView={false}>
            <div className="hero__actions">
              <StarBorder as="a" href="#download" color="#FF8A8E">
                <AppleGlyph />
                {t.hero.ctaPrimary}
              </StarBorder>
              <a href="#onestart" className="btn btn-ghost">
                {t.hero.ctaSecondary}
              </a>
            </div>
          </AnimatedContent>
        </div>

        <div className="hero__visual">
          <DeviceFrame src={HOME} alt="SyncRun — 하나의 Start 홈 화면" width={318} priority glow="accent" />
        </div>
      </div>

      <a href="#onestart" className="hero__scroll" aria-label={t.hero.scroll}>
        <span className="hero__scroll-mouse" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
      </a>
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
