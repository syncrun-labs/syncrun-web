import AnimatedContent from "../reactbits/AnimatedContent";
import BumpPair from "../ui/BumpPair";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

/**
 * Bump — 맞댐. 카피 왼쪽, 두 폰이 가까워지는 장면 오른쪽.
 * 결성의 신호는 앱에서도 인원이 올라가는 것이라, 그 사실만 보여준다. 링·리플·스파크는 쓰지 않는다.
 */
export default function Bump() {
  const { t } = useLang();
  const b = t.bump;

  return (
    <section className="section bump" id="bump">
      <div className="container story">
        <AnimatedContent direction="right" distance={36}>
          <div className="story__copy">
            <h2 className="h2">{b.title}</h2>
            <p className="lede">{b.lede}</p>
            <Facts items={b.facts} />
          </div>
        </AnimatedContent>

        <div className="story__visual">
          <BumpPair />
        </div>
      </div>
    </section>
  );
}
