import AnimatedContent from "../reactbits/AnimatedContent";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

/**
 * OneStart — 버튼 하나. 카피와 시각이 좌우로 갈리지 않고 가운데 한 단으로 간다.
 * 앱의 Start 버튼이 상태에 따라 어떻게 보이는지를 세 개 나란히 놓는 것이 이 섹션의 전부다 —
 * 혼자 [시작], 결성되면 인원 뱃지와 [준비], 마지막 주자면 다시 [시작].
 */
export default function OneStart() {
  const { t } = useLang();
  const o = t.oneStart;

  return (
    <section className="section onestart" id="onestart">
      <div className="container">
        <AnimatedContent direction="up" distance={28}>
          <div className="section-head section-head--center">
            <h2 className="h2">{o.title}</h2>
            <p className="lede section-head__lede">{o.lede}</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" distance={28} delay={0.1}>
          <ol className="states" aria-label={o.title}>
            {o.states.map((s) => (
              <li className="states__item" key={s.tag}>
                <div className="states__capsule glass">
                  <span className="states__avatars">
                    {(s.count ? Array.from({ length: Math.min(Number(s.count), 3) }) : [0]).map((_, i) => (
                      <span
                        key={i}
                        className="states__avatar"
                        style={{ background: `var(--runner-${i})`, marginLeft: i ? -9 : 0, zIndex: 3 - i }}
                      />
                    ))}
                  </span>
                  {s.count && <span className="states__count tabular">{s.count}</span>}
                  <span className="states__pill">{s.btn}</span>
                </div>
                <span className="states__tag">{s.tag}</span>
              </li>
            ))}
          </ol>
        </AnimatedContent>

        <AnimatedContent direction="up" distance={28} delay={0.16}>
          <Facts items={o.facts} columns={3} variant="plain" className="onestart__facts" />
        </AnimatedContent>
      </div>
    </section>
  );
}
