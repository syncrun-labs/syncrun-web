import AnimatedContent from "../reactbits/AnimatedContent";
import DeviceFrame from "../ui/DeviceFrame";
import Facts from "../ui/Facts";
import card from "@/public/shots/card.png";
import activity from "@/public/shots/activity.png";
import { useLang } from "../../i18n/lang";

/**
 * RunCard — 러닝 카드. 페이지에서 가장 큰 무대다.
 *
 * 카드는 이 제품이 남기는 결과물이라, 좌우로 쪼개지 않고 전폭 중앙에 크게 세운다.
 * 아래에 기록 아카이브를 두 번째 마디로 붙여 '남는다 → 쌓인다'가 한 섹션에서 이어진다.
 */
export default function RunCard() {
  const { t } = useLang();
  const c = t.card;

  return (
    <section className="section card" id="card">
      <div className="container">
        <AnimatedContent direction="up" distance={28}>
          <div className="section-head section-head--center">
            <h2 className="h2">{c.title}</h2>
            <p className="lede section-head__lede">{c.lede}</p>
          </div>
        </AnimatedContent>

        <div className="card__stage">
          <DeviceFrame src={card} alt={c.cardAlt} width={352} glow="accent" />
        </div>

        <AnimatedContent direction="up" distance={28}>
          <Facts items={c.facts} columns={3} className="card__facts" />
        </AnimatedContent>
      </div>

      <div className="container card__archive">
        <AnimatedContent direction="right" distance={36}>
          <div className="card__archive-copy">
            <h3 className="h3">{c.archive.title}</h3>
            <p className="lede">{c.archive.body}</p>
          </div>
        </AnimatedContent>
        <div className="card__archive-visual">
          <DeviceFrame src={activity} alt={c.activityAlt} width={252} glow="none" />
        </div>
      </div>
    </section>
  );
}
