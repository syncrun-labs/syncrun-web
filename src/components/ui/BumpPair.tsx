import { motion, useReducedMotion } from "framer-motion";
import home from "@/public/shots/home.png";
import DeviceFrame from "./DeviceFrame";
import { shouldSkipReveal } from "../../lib/reveal";
import { useLang } from "../../i18n/lang";

/**
 * BumpPair — 맞댐의 실제 모습. 두 홈 화면이 가까워지고, 그 위 인원이 1에서 2가 된다.
 * 앱에서 결성의 신호는 인원이 올라가는 것이다 — 그 사실만 보여준다. 리플이나 스파크는 없다.
 *
 * 폰은 뷰포트에 들어올 때 서로를 향해 기울며 모이고, 정착한 뒤 숫자가 바뀐다.
 * 숫자 1과 2는 같은 자리에 겹쳐 두고 투명도로 교차한다 — 상태가 없어 서버와 클라이언트의 DOM이 같다.
 * 건너뛰기(reduced-motion·`?reveal=all`)면 처음부터 최종 상태다.
 */
export default function BumpPair() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const skip = shouldSkipReveal() || !!reduce;

  const ease = [0.16, 1, 0.3, 1] as const;
  const view = { once: true, amount: 0.45 } as const;
  const phone = (side: -1 | 1) => ({
    initial: { x: side * 44, rotate: side * -7, opacity: 0 },
    final: { x: side * 10, rotate: side * 2, opacity: 1 },
  });
  const phones = [
    { key: "l", cls: "bump-pair__phone bump-pair__phone--l", ...phone(-1) },
    { key: "r", cls: "bump-pair__phone bump-pair__phone--r", ...phone(1) },
  ];
  /* 폰이 정착(0.9s)한 다음에 숫자가 바뀐다 */
  const one = { initial: { opacity: 1, y: 0 }, final: { opacity: 0, y: -8 }, delay: 1.0 };
  const two = { initial: { opacity: 0, y: 10 }, final: { opacity: 1, y: 0 }, delay: 1.05 };

  return (
    <div className="bump-pair" role="img" aria-label={t.bump.alt}>
      {phones.map((p) => (
        // 서버는 숨긴 초기 상태를 그린다. 건너뛸 때도 같은 motion 요소를 유지하고 즉시 최종 상태로 animate 한다.
        <motion.div
          key={p.key}
          className={p.cls}
          initial={p.initial}
          animate={skip ? p.final : undefined}
          whileInView={skip ? undefined : p.final}
          viewport={view}
          transition={skip ? { duration: 0 } : { duration: 0.9, ease }}
        >
          <DeviceFrame
            src={home}
            alt=""
            width="min(188px, 40vw)"
            tilt={false}
            float={false}
            enter={false}
            glow="none"
          />
        </motion.div>
      ))}

      <div className="bump-pair__count" aria-hidden="true">
        <span className="bump-pair__n tabular">
          {[
            { key: "1", d: one },
            { key: "2", d: two },
          ].map(({ key, d }) => (
            <motion.span
              key={key}
              className={`bump-pair__digit bump-pair__digit--${key}`}
              initial={d.initial}
              animate={skip ? d.final : undefined}
              whileInView={skip ? undefined : d.final}
              viewport={view}
              transition={skip ? { duration: 0 } : { duration: 0.45, ease, delay: d.delay }}
            >
              {key}
            </motion.span>
          ))}
        </span>
        <span className="bump-pair__bar" />
        <span className="bump-pair__label">{t.bump.countLabel}</span>
      </div>
    </div>
  );
}
