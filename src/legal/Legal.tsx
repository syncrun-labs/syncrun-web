"use client";

import Markdown from "./Markdown";
import styles from "./Legal.module.css";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langPath } from "../site/config";
import { legalCopy } from "../i18n/legal";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import { LEGAL_DOCS, type LegalDocKey } from "./docs";
import d from "../ui/doc.module.css";
import { DocHeader, DocFooter } from "../ui/Doc";

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
      <DocHeader
        home={HOME}
        links={[
          { href: HOME, label: c.nav.home },
          { href: SUPPORT, label: c.nav.support },
        ]}
        lang={lang}
        paths={paths}
      />

      <main className={d.doc}>
        <div className="container">
          <section className={d.head}>
            <span className="doc__kicker">Legal</span>
            <h1 className={d.title}>{c.head.title}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
          </section>

          {c.notice ? (
            <aside className={styles.notice}>
              {c.notice.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                {c.notice.askPrefix}
                <a href={MAILTO} className={d["inline-link"]}>
                  {SUPPORT_EMAIL}
                </a>
                {c.notice.askMiddle}
                <a href={COMPANY} className={d["inline-link"]}>
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

      <DocFooter
        owner="SyncRun Labs"
        links={[
          { href: HOME, label: c.foot.home },
          { href: COMPANY, label: c.foot.company },
          { href: SUPPORT, label: c.foot.support },
          { href: MAILTO, label: c.foot.contact },
        ]}
      />
    </>
  );
}
