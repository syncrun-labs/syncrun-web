"use client";

import "./styles/sections.css";
import "./styles/course.css";

import { LangProvider, type LangPaths } from "./i18n/lang";
import type { Lang } from "./i18n/dict";
import Course from "./components/course/Course";
import Footer from "./components/sections/Footer";

/**
 * 랜딩 — 페이지 전체가 한 번의 러닝인 가로 코스(`Course`)와, 코스가 끝난 뒤의 푸터.
 */
export default function App({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  return (
    <LangProvider lang={lang} paths={paths}>
      {/* 타이포·컨테이너 폭을 랜딩 안으로 가둔다 — 공용 클래스를 문서형 페이지가 같이 쓴다 */}
      <div className="landing">
        <main>
          <Course />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
