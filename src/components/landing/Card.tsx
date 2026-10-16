import { useRef, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import after from "@/public/scenes/after.jpg";
import RunCardArt from "../scenes/RunCardArt";
import { useLang } from "../../i18n/lang";
import { useProgress } from "../../lib/useProgress";

/**
 * 카드 — 끝나면 이미 있다.
 *
 * 화면에 들어오면 카드가 떨어지듯 내려앉고 경로가 출발점부터 한 번 그려진다(앱이 카드를 열 때와 같은 규칙).
 * 손에 든 것처럼 포인터를 따라 기울고, 놓으면 제자리로 돌아온다. [다시 그리기]는 앱의 재생 컨트롤처럼 처음부터 다시 그린다.
 * 옆의 사진은 러닝 직후 편의점 앞 — 사진 속 폰 화면 모양대로 잘라 같은 카드를 띄운다.
 */

/** 사진 속 폰 화면. 마스크(`after-screen.png`)가 가장자리를 자르므로 조금 크게 둔다 */
const PHONE = { cx: 72.4, cy: 52.7, w: 36, h: 59, rot: 12.1 } as const;
const TILT = 9; // 최대 기울기(도)

export default function Card() {
  const { t } = useLang();
  const c = t.card;
  const ref = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useProgress(ref, "pass");

  const art = { date: c.date, together: c.together, pace: c.pace, runners: c.runners, names: t.crew };

  const replay = () => {
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove("is-replay");
    void el.offsetWidth; // 애니메이션을 처음부터 다시 걸기 위해 스타일을 한 번 확정한다
    el.classList.add("is-replay");
  };

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * TILT * 2).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * TILT * 2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const untilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <section className="card" id="card" ref={ref} data-chapter="5">
      <div className="card__grid container">
        <div className="card__copy">
          <h2 className="h2">
            <span className="line">{c.title[0]}</span>
            <span className="line">{c.title[1]}</span>
          </h2>
          <p className="lede card__lede">{c.lede}</p>
        </div>

        <div className="card__stage">
          <div className="card__tilt" onPointerMove={tilt} onPointerLeave={untilt}>
            <div className="card__art" ref={cardRef} role="img" aria-label={c.cardAlt}>
              <RunCardArt {...art} />
              <span className="card__glare" aria-hidden="true" />
            </div>
          </div>
          <button type="button" className="card__replay" onClick={replay}>
            {c.replay}
          </button>
        </div>

        <ol className="card__facts">
          {c.facts.map((f, i) => (
            <li key={f.k}>
              <span className="card__fact-n num">{i + 1}</span>
              <span>
                <strong>{f.k}</strong> {f.v}
              </span>
            </li>
          ))}
        </ol>

        <figure className="card__shot">
          <Image src={after} alt={c.photoAlt} fill sizes="(max-width: 860px) 70vw, 26vw" className="card__photo" />
          <div className="card__phone-mask" aria-hidden="true">
            <div
              className="card__phone"
              style={
                {
                  left: `${PHONE.cx}%`,
                  top: `${PHONE.cy}%`,
                  width: `${PHONE.w}%`,
                  height: `${PHONE.h}%`,
                  "--rot": `${PHONE.rot}deg`,
                } as CSSProperties
              }
            >
              <RunCardArt {...art} still />
            </div>
          </div>
          <div className="grain" aria-hidden="true" />
        </figure>
      </div>
    </section>
  );
}
