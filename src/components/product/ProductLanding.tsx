import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import LangToggle from "../LangToggle";
import { useLang } from "../../i18n/lang";
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

function Nav({ items, store }: { items: ProductCopy["nav"]; store: string }) {
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
          <LangToggle />
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
 * 언어는 여기서 한 번만 읽고 섹션에는 제 몫의 문구만 넘긴다. 섹션은 훅을 쓰지 않아,
 * 서버 컴포넌트로 옮길 때 이 파일만 언어를 props로 받게 바꾸면 된다.
 * 브라우저가 필요한 곳은 `Hero`(축소 모션·Android)와 `Faq`(열고 닫는 모션) 두 곳이다.
 */
export default function ProductLanding() {
  const { lang, base } = useLang();
  const c = productCopy[lang];

  return (
    <>
      <Nav items={c.nav} store={c.store} />
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
