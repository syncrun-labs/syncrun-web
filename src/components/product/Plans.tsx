import type { ProductCopy } from "../../i18n/product";
import ui from "./ui.module.css";
import s from "./Plans.module.css";

/** 플랜 세 가지. 인원·가격 같은 숫자는 허브 요구사항과 같아야 한다. */
export default function Plans({ copy }: { copy: ProductCopy["plans"] }) {
  return (
    <section id="plans" className={`${s.plans} ${ui.wrap}`}>
      <h2>{copy.title}</h2>
      <p className={ui.lede}>{copy.lede}</p>
      <div className={s.grid}>
        {copy.items.map((p) => (
          <article key={p.name}>
            <h3>{p.name}</h3>
            <p className={s.who}>{p.who}</p>
            <p className={s.people}>
              <strong>{p.people}</strong> {p.peopleLabel}
            </p>
            <ul>
              {p.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className={`${ui.note} ${s.note}`}>{copy.note}</p>
    </section>
  );
}
