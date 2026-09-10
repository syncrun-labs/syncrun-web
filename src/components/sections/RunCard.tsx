import AnimatedContent from "../reactbits/AnimatedContent";
import GradientText from "../reactbits/GradientText";
import DeviceFrame from "../ui/DeviceFrame";
import { useLang } from "../../i18n/lang";

const CARD = `${import.meta.env.BASE_URL}shots/card.png`;

export default function RunCard() {
  const { t } = useLang();
  const c = t.card;

  return (
    <section className="section card snap-chapter" id="card">
      <div className="container card__grid">
        <AnimatedContent direction="right" distance={40}>
          <div className="card__visual">
            <DeviceFrame src={CARD} alt="SyncRun 러닝 카드 — 함께 뛴 경로 루트 아트" width={302} glow="accent" />
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="card__copy">
            <h2 className="h2">
              {c.titleLead} <GradientText colors={["#DC565B", "#FF8A8E", "#DC565B"]}>{c.titleAccent}</GradientText>
              {c.titleTail}
            </h2>
            <p className="lede">{c.lede}</p>
            <ul className="card__edits">
              {c.edits.map((e) => (
                <li key={e} className="card__edit">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
