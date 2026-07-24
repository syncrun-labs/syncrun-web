import AnimatedContent from "../reactbits/AnimatedContent";
import DeviceFrame from "../ui/DeviceFrame";
import { useLang } from "../../i18n/lang";

const ACTIVITY = `${import.meta.env.BASE_URL}shots/activity.png`;

export default function Activity() {
  const { t } = useLang();
  const a = t.activity;

  return (
    <section className="section activity snap-chapter" id="activity">
      <div className="container activity__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="activity__copy">
            <h2 className="h2">{a.title}</h2>
            <p className="lede">{a.lede}</p>
            <dl className="fact-list">
              {a.facts.map((f) => (
                <div key={f.k} className="fact-list__row">
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="activity__visual">
            <DeviceFrame src={ACTIVITY} alt="SyncRun 활동 — 이야기 대시보드" width={300} glow="cool" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
