"use client";

import "./components/ui/ui.css";
import "./styles/sections.css";

import { LangProvider, type LangPaths } from "./i18n/lang";
import type { Lang } from "./i18n/dict";
import ClickSpark from "./components/reactbits/ClickSpark";
import Nav from "./components/sections/Nav";
import Hero from "./components/sections/Hero";
import OneStart from "./components/sections/OneStart";
import Bump from "./components/sections/Bump";
import LiveSession from "./components/sections/LiveSession";
import RunCard from "./components/sections/RunCard";
import Features from "./components/sections/Features";
import CTA from "./components/sections/CTA";
import Footer from "./components/sections/Footer";

/**
 * 랜딩 — 히어로가 이야기를 세 마디로 던지고, 그 아래 섹션이 마디마다 한 번씩 답한다.
 * 정확하게 → 버튼은 하나다 · 맞대면 → 그 자리에서 우리가 된다 · 남는다 → 끝나면 이미 만들어져 있다.
 */
export default function App({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <LangProvider lang={lang} paths={paths}>
      <ClickSpark sparkColor="#DC565B">
        {/* 타이포·컨테이너 폭을 랜딩 안으로 가둔다 — 공용 클래스를 문서형 페이지가 같이 쓴다 */}
        <div className="landing">
          <Nav />
          <main>
            <Hero />
            <OneStart />
            <Bump />
            <LiveSession />
            <RunCard />
            <Features />
            <CTA />
          </main>
          <Footer />
        </div>
      </ClickSpark>
    </LangProvider>
  );
}
