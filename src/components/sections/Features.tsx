import SpotlightCard from "../reactbits/SpotlightCard";
import AnimatedContent from "../reactbits/AnimatedContent";
import { useLang } from "../../i18n/lang";
import type { CSSProperties } from "react";

export default function Features() {
  const { t } = useLang();
  const f = t.features;

  return (
    <section className="section features snap-chapter" id="features">
      <div className="container">
        <div className="section-head section-head--center">
          <h2 className="h2">{f.title}</h2>
          <p className="lede section-head__lede">{f.lede}</p>
        </div>

        <div className="features__grid">
          {f.items.map((it, i) => (
            <AnimatedContent
              key={it.title}
              className={`feature-cell ${it.wide ? "feature--wide" : ""}`}
              direction="up"
              distance={32}
              delay={(i % 3) * 0.08}
            >
              <SpotlightCard className="feature" spotlightColor="rgba(220, 86, 91, 0.18)">
                <span className="feature__accent" style={{ background: `var(--runner-${it.runner})` } as CSSProperties} />
                <h3 className="feature__title">{it.title}</h3>
                <p className="feature__body">{it.body}</p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
