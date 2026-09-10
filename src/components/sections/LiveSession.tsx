import AnimatedContent from "../reactbits/AnimatedContent";
import DeviceFrame from "../ui/DeviceFrame";
import { useLang } from "../../i18n/lang";

const RUNNING = `${import.meta.env.BASE_URL}shots/running.png`;

export default function LiveSession() {
  const { t } = useLang();
  const l = t.live;

  return (
    <section className="section live snap-chapter" id="live">
      <div className="container live__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="live__visual">
            <DeviceFrame src={RUNNING} alt="SyncRun 러닝 화면 — 실측 지표" width={288} glow="accent" />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="live__copy">
            <h2 className="h2">{l.title}</h2>
            <p className="lede">{l.lede}</p>
            <dl className="live__facts">
              {l.metrics.map((f) => (
                <div key={f.k} className="live__fact">
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
