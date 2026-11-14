"use client";

import "./styles/sections.css";

import type { LangPaths } from "./i18n/lang";
import type { Lang } from "./i18n/dict";
import ProductLanding from "./components/product/ProductLanding";
import page from "./components/product/ProductLanding.module.css";
import Footer from "./components/sections/Footer";

/**
 * 랜딩. 제품 설명(`ProductLanding`)과 그 뒤의 푸터.
 */
export default function App({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <div className={`landing ${page.page}`}>
      <ProductLanding lang={lang} paths={paths} />
      <Footer lang={lang} />
    </div>
  );
}
