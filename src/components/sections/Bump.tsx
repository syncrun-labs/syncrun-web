import AnimatedContent from "../reactbits/AnimatedContent";
import SplitText from "../reactbits/SplitText";
import GradientText from "../reactbits/GradientText";
import BumpScene from "../ui/BumpScene";
import { useLang } from "../../i18n/lang";

export default function Bump() {
  const { t } = useLang();
  const b = t.bump;

  return (
    <section className="section bump section--dark snap-chapter" id="bump">
      <div className="bump__glow" aria-hidden="true" />
      <div className="container bump__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="bump__copy">
            <h2 className="h2 bump__title">
              <SplitText text={b.titleTop} splitBy="words" />
              <br />
              <GradientText colors={["#FF8A8E", "#DC565B", "#FFB48A"]}>{b.titleAccent}</GradientText>
            </h2>
            <p className="lede bump__lede">{b.lede}</p>

            <dl className="bump__stats">
              {b.stats.map((s) => (
                <div className="bump__stat" key={s.label}>
                  <dt className="bump__stat-v tabular">
                    {s.value}
                    <em>{s.unit}</em>
                  </dt>
                  <dd className="bump__stat-k">{s.label}</dd>
                </div>
              ))}
            </dl>

            <p className="bump__note">{b.note}</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="bump__visual">
            <BumpScene />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
