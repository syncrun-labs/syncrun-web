"use client";

import "./styles/sections.css";
import "./styles/landing.css";

import { LangProvider, type LangPaths } from "./i18n/lang";
import type { Lang } from "./i18n/dict";
import Landing from "./components/landing/Landing";
import Footer from "./components/sections/Footer";

/**
 * 랜딩 — 워밍업부터 오늘 저녁까지 한 번의 러닝(`Landing`)과 그 뒤의 푸터.
 */
export default function App({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <LangProvider lang={lang} paths={paths}>
      {/* 타이포·컨테이너 폭을 랜딩 안으로 가둔다 — 공용 클래스를 문서형 페이지가 같이 쓴다 */}
      <div className="landing">
        <main>
          <Landing />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
