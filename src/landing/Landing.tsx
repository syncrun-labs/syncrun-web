import type { LangPaths } from "../i18n/lang";
import type { Lang } from "../i18n/dict";
import ProductLanding from "./ProductLanding";
import page from "./ProductLanding.module.css";
import Footer from "./Footer";

/**
 * 랜딩. 제품 설명(`ProductLanding`)과 그 뒤의 푸터.
 */
export default function Landing({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <div className={page.page}>
      <ProductLanding lang={lang} paths={paths} />
      <Footer lang={lang} />
    </div>
  );
}
