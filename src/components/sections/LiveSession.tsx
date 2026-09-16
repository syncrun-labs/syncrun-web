import AnimatedContent from "../reactbits/AnimatedContent";
import DeviceFrame from "../ui/DeviceFrame";
import Facts from "../ui/Facts";
import running from "@/public/shots/running.png";
import { useLang } from "../../i18n/lang";

/**
 * LiveSession — 달리는 동안. 러닝 화면이 왼쪽, 카피가 오른쪽으로 앞 섹션과 좌우를 뒤집는다.
 * 목록은 번호 없이 색 규칙선만 쓴다 — 번호는 맞댐과 러닝 카드 두 곳에만 둔다.
 */
export default function LiveSession() {
  const { t } = useLang();
  const l = t.live;

  return (
    <section className="section live" id="live">
      <div className="container story story--flip">
        <div className="story__visual">
          <DeviceFrame src={running} alt={l.alt} width={292} glow="accent" />
        </div>

        <AnimatedContent direction="left" distance={36}>
          <div className="story__copy">
            <h2 className="h2">{l.title}</h2>
            <p className="lede">{l.lede}</p>
            <Facts items={l.facts} variant="plain" className="live__facts" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
