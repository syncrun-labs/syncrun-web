import AnimatedContent from "../reactbits/AnimatedContent";
import ShinyText from "../reactbits/ShinyText";
import { useLang } from "../../i18n/lang";

export default function OneStart() {
  const { t } = useLang();
  const o = t.oneStart;

  return (
    <section className="section onestart snap-chapter" id="onestart">
      <div className="container onestart__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="onestart__copy">
            <h2 className="h2">
              {o.titleLead} <ShinyText text={o.titleAccent} className="onestart__accent" />
            </h2>
            <ul className="onestart__list">
              {o.points.map((p) => (
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
              <span className="morph__tag mono">{o.solo}</span>
              <div className="morph__capsule glass">
                <span className="morph__avatar" style={{ background: "var(--runner-0)" }} />
                <span className="morph__pill">{o.soloBtn}</span>
              </div>
            </div>

            <div className="morph__arrow" aria-hidden="true">
              <span>{o.bump}</span>
              <svg viewBox="0 0 40 12" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 6h32M28 2l6 4-6 4" />
              </svg>
            </div>

            <div className="morph">
              <span className="morph__tag mono">{o.together}</span>
              <div className="morph__capsule glass morph__capsule--group">
                <span className="morph__avatars">
                  {["var(--runner-0)", "var(--runner-1)", "var(--runner-2)"].map((c, i) => (
                    <span
                      key={i}
                      className="morph__avatar"
                      style={{ background: c, marginLeft: i ? -8 : 0, zIndex: 3 - i }}
                    />
                  ))}
                </span>
                <span className="morph__pill morph__pill--group">{o.togetherBtn}</span>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
