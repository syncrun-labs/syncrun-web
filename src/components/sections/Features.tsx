import AnimatedContent from "../reactbits/AnimatedContent";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

/**
 * Features — 나머지 기능. 사양 블록이라 장면 없이 글자만으로 간다.
 * 아이콘을 하나씩 얹지 않고, 항목마다 다른 러너 팔레트 색의 짧은 규칙선만 둔다.
 */
export default function Features() {
  const { t } = useLang();
  const f = t.features;

  const items = f.items.map((i) => ({ k: i.title, v: i.body, runner: i.runner }));

  return (
    <section className="section features" id="features">
      <div className="container">
        <AnimatedContent direction="up" distance={28}>
          <div className="section-head">
            <h2 className="h2">{f.title}</h2>
            <p className="lede section-head__lede">{f.lede}</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" distance={28} delay={0.08}>
          <Facts items={items} columns={2} variant="plain" />
        </AnimatedContent>
      </div>
    </section>
  );
}
