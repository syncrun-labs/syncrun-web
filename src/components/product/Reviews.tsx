import type { ProductCopy } from "../../i18n/product";
import ui from "./ui.module.css";
import s from "./Reviews.module.css";

/** App Store에 실제로 달린 리뷰와 평점. */
export default function Reviews({ copy }: { copy: ProductCopy["reviews"] }) {
  return (
    <section className={`${s.reviews} ${ui.wrap}`} aria-labelledby="reviews-title">
      <div className={s.head}>
        <h2 id="reviews-title">{copy.title}</h2>
        <p className={s.rating}>
          <strong>{copy.rating}</strong>
          <span>
            {copy.count}
            <br />
            {copy.asOf}
          </span>
        </p>
      </div>
      <div className={s.grid}>
        {copy.items.map((r) => (
          <figure key={r.by}>
            <blockquote>{r.quote}</blockquote>
            <figcaption>{r.by}</figcaption>
          </figure>
        ))}
      </div>
      {copy.note && <p className={`${ui.note} ${s.note}`}>{copy.note}</p>}
    </section>
  );
}
