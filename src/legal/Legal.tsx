"use client";

import "../styles/support.css";
import "../styles/legal.css";

import Markdown from "./Markdown";
import LangToggle from "../components/LangToggle";
import { useLang } from "../i18n/lang";
import { legalCopy } from "../i18n/legal";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import { LEGAL_DOCS, type LegalDocKey } from "./docs";

const MAILTO = supportMailto("[SyncRun 문의]");
const WORDMARK = "/brand/wordmark.png";

/**
 * 약관 화면. 어느 문서인지와 본문은 라우트가 정해서 넘긴다 — `/legal/<슬러그>` 하나가 문서 하나다.
 * 본문은 번역하지 않는다(한국어가 정본이고 앱이 동의를 받는 문서). 탭은 다른 문서 페이지로 가는 링크다.
 */
export default function Legal({ active, source }: { active: LegalDocKey; source: string }) {
  const { lang, base } = useLang();
  const c = legalCopy[lang];
  const HOME = base || "/";

  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <img src={WORDMARK} alt="SyncRun" className="doc-nav__wordmark" />
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              {c.nav.home}
            </a>
            <a href={`${HOME}support`} className="doc-nav__link">
              {c.nav.support}
            </a>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <span className="eyebrow">Legal</span>
            <h1 className="doc__title">{c.head.title}</h1>
            <p className="lede doc__lede">{c.head.lede}</p>
          </section>

          {c.notice ? (
            <aside className="legal-notice">
              {c.notice.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                {c.notice.askPrefix}
                <a href={MAILTO} className="doc__inline-link">
                  {SUPPORT_EMAIL}
                </a>
                {c.notice.askMiddle}
                <a href={`${HOME}company`} className="doc__inline-link">
                  {c.notice.askLink}
                </a>
                {c.notice.askSuffix}
              </p>
            </aside>
          ) : null}

          <div className="legal-tabs" role="tablist" aria-label={c.tabsLabel}>
            {LEGAL_DOCS.map((item) => (
              <a
                key={item.key}
                href={`${base}/legal/${item.slug}`}
                role="tab"
                aria-selected={item.key === active}
                className={`legal-tab${item.key === active ? " is-active" : ""}`}
              >
                {c.tabs[item.key]}
              </a>
            ))}
          </div>

          <article className="legal-doc">
            <Markdown source={source} />
          </article>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className="doc-foot__links">
            <a href={HOME}>{c.foot.home}</a>
            <a href={`${HOME}company`}>{c.foot.company}</a>
            <a href={`${HOME}support`}>{c.foot.support}</a>
            <a href={MAILTO}>{c.foot.contact}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
