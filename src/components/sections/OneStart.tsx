import AnimatedContent from "../reactbits/AnimatedContent";
import ShinyText from "../reactbits/ShinyText";
import Facts from "../ui/Facts";
import { useLang } from "../../i18n/lang";

/** 하나의 Start — 앱의 Start 버튼이 상태에 따라 바뀌는 모습을 왼쪽에, 카피를 오른쪽에. */
export default function OneStart() {
  const { t } = useLang();
  const o = t.oneStart;

  return (
    <section className="section onestart" id="onestart">
      <div className="container story">
        <AnimatedContent direction="right" distance={40}>
          <div className="story__visual onestart__demo">
            <div className="morph">
              <span className="morph__tag">{o.solo}</span>
              <div className="morph__capsule glass">
                <span className="morph__avatar" style={{ background: "var(--runner-0)" }} />
                <span className="morph__pill">{o.soloBtn}</span>
              </div>
            </div>

            <div className="morph__arrow" aria-hidden="true">
              <span>{o.bump}</span>
              <svg viewBox="0 0 40 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 6h32M28 2l6 4-6 4" />
              </svg>
            </div>

            <div className="morph">
              <span className="morph__tag">{o.together}</span>
              <div className="morph__capsule glass morph__capsule--group">
                <span className="morph__avatars">
                  {["var(--runner-0)", "var(--runner-1)"].map((c, i) => (
                    <span
                      key={c}
                      className="morph__avatar"
                      style={{ background: c, marginLeft: i ? -8 : 0, zIndex: 2 - i }}
                    />
                  ))}
                </span>
                {/* 결성되면 인원 뱃지가 붙고 버튼은 [준비]가 된다 — 앱과 같다 */}
                <span className="morph__count tabular">2</span>
                <span className="morph__pill morph__pill--group">{o.togetherBtn}</span>
              </div>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="left" distance={40} delay={0.1}>
          <div className="story__copy">
            <h2 className="h2">
              {o.titleLead} <ShinyText text={o.titleAccent} className="onestart__accent" />
            </h2>
            <Facts items={o.facts} />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
