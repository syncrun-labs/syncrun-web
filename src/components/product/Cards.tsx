import Image from "next/image";
import calendar from "@/public/product/calendar.jpg";
import together from "@/public/product/together.jpg";
import type { ProductCopy } from "../../i18n/product";
import { barStyle } from "./runners";
import ui from "./ui.module.css";
import s from "./Cards.module.css";

const SHOTS = [together, calendar];

/** 러닝 카드. PC는 카드와 설명을 번갈아 두 단으로, 모바일은 옆으로 넘기는 목록으로 둔다. */
export default function Cards({ copy }: { copy: ProductCopy["card"] }) {
  return (
    <section id="card" className={`${s.cards} ${ui.wrap}`}>
      <h2>
        {copy.title[0]}
        <br />
        {copy.title[1]}
      </h2>
      <p className={ui.lede}>{copy.lede}</p>
      <div className={s.rows} tabIndex={0} role="region" aria-label={copy.shotsLabel}>
        {copy.shots.map((shot, i) => (
          <figure key={shot.caption} className={s.row}>
            <Image className={s.image} src={SHOTS[i]} alt={shot.alt} sizes="(max-width: 860px) 78vw, 360px" />
            <figcaption style={barStyle(i)}>
              <h3>{shot.caption}</h3>
              <p>{shot.body}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
