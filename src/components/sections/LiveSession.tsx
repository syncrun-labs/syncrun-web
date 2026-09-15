import AnimatedContent from "../reactbits/AnimatedContent";
import running from "@/public/shots/running.png";
import DeviceFrame from "../ui/DeviceFrame";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

export default function LiveSession() {
  const { t } = useLang();
  const l = t.live;

  return (
    <section className="section live" id="live">
      <div className="container story">
        <AnimatedContent direction="right" distance={40}>
          <div className="story__copy">
            <h2 className="h2">{l.title}</h2>
            <p className="lede">{l.lede}</p>
            <Facts items={l.facts} />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="story__visual">
            <DeviceFrame src={running} alt="SyncRun 러닝 화면 — 실시간 지표" width={288} glow="accent" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
