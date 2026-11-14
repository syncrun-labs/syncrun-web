import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import LangToggle from "../LangToggle";
import type { Lang } from "../../i18n/dict";
import type { LangPaths } from "../../i18n/lang";
import { langBase } from "../../site/config";
import { productCopy, type ProductCopy } from "../../i18n/product";
import Cards from "./Cards";
import Faq from "./Faq";
import Features from "./Features";
import Hero from "./Hero";
import Plans from "./Plans";
import Reviews from "./Reviews";
import { StoreButton } from "./ui";
import ui from "./ui.module.css";
import s from "./ProductLanding.module.css";

function Nav({
  items,
  store,
  lang,
  paths,
}: {
  items: ProductCopy["nav"];
  store: string;
  lang: Lang;
  paths: LangPaths;
}) {
  return (
    <header className={s.nav}>
      <div className={s.bar}>
        <a href="#top" className={s.brand}>
          <Image src={wordmark} alt="SyncRun" priority />
        </a>
        <nav className={s.links}>
          {items.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className={s.end}>
          <LangToggle lang={lang} paths={paths} />
          <StoreButton label={store} className={s.compact} />
        </div>
      </div>
    </header>
  );
}

function Closing({ copy, store, base }: { copy: ProductCopy["closing"]; store: string; base: string }) {
  return (
    <section className={s.closing}>
      <h2>
        {copy.title[0]}
        <br />
        <em>{copy.title[1]}</em>
      </h2>
      <p className={ui.lede}>{copy.lede}</p>
      <div className={s.actions}>
        <StoreButton label={store} />
        <a className={ui.link} href={`${base}/support`}>
          {copy.help}
        </a>
      </div>
    </section>
  );
}

/**
 * 랜딩. 스크롤 연출 없이 제품을 차례로 설명한다.
 * 무엇인지(첫 화면) → 어떻게 쓰는지 → 기능 → 크루 → 카드 → 리뷰 → 플랜 → 질문 → 다운로드.
 *
 * 라우트가 넘긴 언어로 문구를 고르고, 각 섹션에는 제 몫의 문구를 넘긴다.
 * 브라우저가 필요한 곳은 `Hero`(축소 모션·Android)와 `Faq`(열고 닫는 모션) 두 곳이다.
 */
export default function ProductLanding({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  const base = langBase(lang);
  const c = productCopy[lang];

  return (
    <>
      <Nav items={c.nav} store={c.store} lang={lang} paths={paths} />
      <main id="top">
        <Hero copy={c.hero} store={c.store} />
        <Features how={c.how} together={c.together} solo={c.solo} crew={c.crew} />
        <Cards copy={c.card} />
        <Reviews copy={c.reviews} />
        <Plans copy={c.plans} />
        <Faq copy={c.faq} base={base} />
        <Closing copy={c.closing} store={c.store} base={base} />
      </main>
    </>
  );
}
