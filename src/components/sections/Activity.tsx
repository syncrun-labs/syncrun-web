import AnimatedContent from "../reactbits/AnimatedContent";
import activity from "@/public/shots/activity.png";
import DeviceFrame from "../ui/DeviceFrame";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

export default function Activity() {
  const { t } = useLang();
  const a = t.activity;

  return (
    <section className="section activity" id="activity">
      <div className="container story">
        <AnimatedContent direction="right" distance={40}>
          <div className="story__copy">
            <h2 className="h2">{a.title}</h2>
            <p className="lede">{a.lede}</p>
            <Facts items={a.facts} />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="story__visual">
            <DeviceFrame src={activity} alt="SyncRun 활동 — 이야기 화면" width={300} glow="cool" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
