"use client";

import "./styles/sections.css";

import { LangProvider, type LangPaths } from "./i18n/lang";
import type { Lang } from "./i18n/dict";
import ProductLanding from "./components/product/ProductLanding";
import page from "./components/product/ProductLanding.module.css";
import Footer from "./components/sections/Footer";

/**
 * 랜딩. 제품 설명(`ProductLanding`)과 그 뒤의 푸터.
 */
export default function App({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <LangProvider lang={lang} paths={paths}>
      {/* 타이포·컨테이너 폭을 랜딩 안으로 가둔다 — 공용 클래스를 문서형 페이지가 같이 쓴다 */}
      <div className={`landing ${page.page}`}>
        <ProductLanding />
        <Footer />
      </div>
    </LangProvider>
  );
}
