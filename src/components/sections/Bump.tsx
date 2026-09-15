import AnimatedContent from "../reactbits/AnimatedContent";
import GradientText from "../reactbits/GradientText";
import BumpPair from "../ui/BumpPair";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

/** 맞댐 — 카피 왼쪽, 두 폰이 가까워지는 장면 오른쪽. 장면은 자기 등장을 스스로 맡는다. */
export default function Bump() {
  const { t } = useLang();
  const b = t.bump;

  return (
    <section className="section bump" id="bump">
      <div className="container story">
        <AnimatedContent direction="right" distance={40}>
          <div className="story__copy">
            <h2 className="h2">
              {b.titleTop}
              <br />
              <GradientText colors={["#DC565B", "#FF8A8E", "#DC565B"]}>{b.titleAccent}</GradientText>
            </h2>
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
