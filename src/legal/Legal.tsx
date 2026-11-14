"use client";

import "../styles/support.css";
import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";

import Markdown from "./Markdown";
import styles from "./Legal.module.css";
import LangToggle from "../components/LangToggle";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langPath } from "../site/config";
import { legalCopy } from "../i18n/legal";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import { LEGAL_DOCS, type LegalDocKey } from "./docs";

const MAILTO = supportMailto("[SyncRun 문의]");

/**
 * 약관 화면. 어느 문서인지와 본문은 라우트가 정해서 넘긴다 — `/legal/<슬러그>` 하나가 문서 하나다.
 * 본문은 번역하지 않는다(한국어가 정본이고 앱이 동의를 받는 문서). 탭은 다른 문서 페이지로 가는 링크다.
 */
export default function Legal({
  active,
  source,
  lang,
  paths,
}: {
  active: LegalDocKey;
  source: string;
  lang: Lang;
  paths: LangPaths;
}) {
  const c = legalCopy[lang];
  const HOME = langPath(lang, "/");
  const SUPPORT = langPath(lang, "/support");
  const COMPANY = langPath(lang, "/company");

  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <Image src={wordmark} alt="SyncRun" className="doc-nav__wordmark" priority />
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              {c.nav.home}
            </a>
            <a href={SUPPORT} className="doc-nav__link">
              {c.nav.support}
            </a>
            <LangToggle lang={lang} paths={paths} />
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <span className="doc__kicker">Legal</span>
            <h1 className="doc__title">{c.head.title}</h1>
            <p className="lede doc__lede">{c.head.lede}</p>
          </section>

          {c.notice ? (
            <aside className={styles.notice}>
              {c.notice.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                {c.notice.askPrefix}
                <a href={MAILTO} className="doc__inline-link">
                  {SUPPORT_EMAIL}
                </a>
                {c.notice.askMiddle}
                <a href={COMPANY} className="doc__inline-link">
                  {c.notice.askLink}
                </a>
                {c.notice.askSuffix}
              </p>
            </aside>
          ) : null}

          <div className={styles.tabs} role="tablist" aria-label={c.tabsLabel}>
            {LEGAL_DOCS.map((item) => (
              <a
                key={item.key}
                href={langPath(lang, `/legal/${item.slug}`)}
                role="tab"
                aria-selected={item.key === active}
                className={item.key === active ? `${styles.tab} ${styles.active}` : styles.tab}
              >
                {c.tabs[item.key]}
              </a>
            ))}
          </div>

          {/* legal-doc은 약관 URL 계약 테스트가 찾는 이름이라 모듈 클래스와 함께 둔다 */}
          <article className={`legal-doc ${styles.doc}`}>
            <Markdown source={source} />
          </article>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className="doc-foot__links">
            <a href={HOME}>{c.foot.home}</a>
            <a href={COMPANY}>{c.foot.company}</a>
            <a href={SUPPORT}>{c.foot.support}</a>
            <a href={MAILTO}>{c.foot.contact}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
