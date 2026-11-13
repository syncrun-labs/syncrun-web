import live from "@/public/product/live.jpg";
import type { ProductCopy } from "../../i18n/product";
import { FeatureList, Screen } from "./ui";
import { RUNNERS } from "./runners";
import ui from "./ui.module.css";
import s from "./Features.module.css";

type Props = Pick<ProductCopy, "how" | "together" | "solo" | "crew">;

/** 어떻게 쓰는지와 무엇을 하는지: 함께 뛰는 방법 세 단계, 함께 뛰기, 혼자 뛰기와 크루. */
export default function Features({ how, together, solo, crew }: Props) {
  return (
    <>
      <section className={`${s.how} ${ui.wrap}`} aria-labelledby="how-title">
        <h2 id="how-title">{how.title}</h2>
        <ol>
          {how.steps.map((step, i) => (
            <li key={step.k}>
              <span className={s.n} style={{ color: RUNNERS[i] }}>
                {i + 1}
              </span>
              <h3>{step.k}</h3>
              <p>{step.v}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="together" className={`${s.feature} ${ui.wrap}`}>
        <Screen src={live} alt={together.alt} />
        <div>
          <h2>
            {together.title[0]}
            <br />
            {together.title[1]}
          </h2>
          <p className={ui.lede}>{together.lede}</p>
          <FeatureList items={together.facts} />
        </div>
      </section>

      <section className={`${s.details} ${ui.wrap}`}>
        <section id="solo" aria-labelledby="solo-title">
          <h2 id="solo-title">
            {solo.title[0]}
            <br />
            {solo.title[1]}
          </h2>
          <p className={ui.lede}>{solo.lede}</p>
          <FeatureList items={solo.facts} />
        </section>
        <section id="crew" aria-labelledby="crew-title">
          <h2 id="crew-title">
            {crew.title[0]}
            <br />
            {crew.title[1]}
          </h2>
          <ul className={s.pains}>
            {crew.pains.map((pain) => (
              <li key={pain}>{pain}</li>
            ))}
          </ul>
          <p className={ui.lede}>{crew.lede}</p>
          <FeatureList items={crew.facts} />
          <p className={`${ui.note} ${s.aside}`}>{crew.note}</p>
        </section>
      </section>
    </>
  );
}
