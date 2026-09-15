import AnimatedContent from "../reactbits/AnimatedContent";
import card from "@/public/shots/card.png";
import GradientText from "../reactbits/GradientText";
import DeviceFrame from "../ui/DeviceFrame";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

export default function RunCard() {
  const { t } = useLang();
  const c = t.card;

  return (
    <section className="section card" id="card">
      <div className="container story">
        <AnimatedContent direction="right" distance={40}>
          <div className="story__visual">
            <DeviceFrame src={card} alt="SyncRun 러닝 카드 — 함께 뛴 경로" width={302} glow="accent" />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="story__copy">
            <h2 className="h2">
              {c.titleLead} <GradientText colors={["#DC565B", "#FF8A8E", "#DC565B"]}>{c.titleAccent}</GradientText>
              {c.titleTail}
            </h2>
            <p className="lede">{c.lede}</p>
            <Facts items={c.facts} />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
