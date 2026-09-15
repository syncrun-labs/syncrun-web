import AnimatedContent from "../reactbits/AnimatedContent";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

/** 기능 — 카드도 아이콘도 없이 번호 목록 두 열. 항목마다 러너 팔레트 색 바 하나. */
export default function Features() {
  const { t } = useLang();
  const f = t.features;

  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section-head">
          <h2 className="h2">{f.title}</h2>
          <p className="lede section-head__lede">{f.lede}</p>
        </div>

        <AnimatedContent direction="up" distance={28}>
          <Facts items={f.items.map((it) => ({ k: it.title, v: it.body, runner: it.runner }))} columns={2} />
        </AnimatedContent>
      </div>
    </section>
  );
}
