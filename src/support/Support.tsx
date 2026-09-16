"use client";

import "../styles/support.css";
import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";

import LangToggle from "../components/LangToggle";
import { useLang } from "../i18n/lang";
import { supportCopy } from "../i18n/support";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";

const EMAIL = SUPPORT_EMAIL;
const MAILTO = supportMailto("[SyncRun 문의]");

export default function Support() {
  const { lang, base } = useLang();
  const c = supportCopy[lang];
  // 언어별 경로 — ko는 접두 없음, en은 /en
  const HOME = base || "/";
  const LEGAL = `${base}/legal/terms-of-service`;
  const COMPANY_PAGE = `${base}/company`;

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
            <a href={COMPANY_PAGE} className="doc-nav__link">
              {c.nav.company}
            </a>
            <LangToggle />
            <a href={MAILTO} className="btn btn-primary doc-nav__cta">
              {c.nav.cta}
            </a>
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <span className="doc__kicker">Support</span>
            <h1 className="doc__title">{c.head.title}</h1>
            <p className="lede doc__lede">{c.head.lede}</p>
            <p className="doc__meta mono">{c.head.requirements}</p>
          </section>

          <section className="glass doc__contact" id="contact">
            <div className="doc__contact-main">
              <span className="doc__label mono">{c.contact.label}</span>
              <a href={MAILTO} className="doc__email">
                {EMAIL}
              </a>
              <p className="doc__contact-note">{c.contact.note}</p>
            </div>
            <div className="doc__contact-side">
              <span className="doc__label mono">{c.contact.sideLabel}</span>
              <ul className="doc__list">
                {c.contact.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="doc__section" id="faq">
            <h2 className="h2 doc__h2">{c.faq.heading}</h2>
            <div className="doc__faq">
              {c.faq.items.map((item, i) => (
                <article key={item.q} className="doc__qa">
                  <span className="doc__qa-num mono tabular">{String(i + 1).padStart(2, "0")}</span>
                  <div className="doc__qa-body">
                    <h3 className="doc__qa-q">{item.q}</h3>
                    {item.a.map((p) => (
                      <p key={p} className="doc__qa-a">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="doc__section" id="permissions">
            <h2 className="h2 doc__h2">{c.permissions.heading}</h2>
            <p className="doc__section-lede">{c.permissions.lede}</p>
            <div className="doc__perms">
              {c.permissions.items.map((p) => (
                <div key={p.name} className="doc__perm">
                  <span className="doc__perm-name">{p.name}</span>
                  <p className="doc__perm-use">{p.use}</p>
                  <span className="doc__perm-off mono">{p.off}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="doc__section" id="privacy">
            <h2 className="h2 doc__h2">{c.account.heading}</h2>
            <div className="doc__cols">
              {c.account.cards.map((card) => (
                <div key={card.h}>
                  <h3 className="doc__h3">{card.h}</h3>
                  <p className="doc__p">
                    {card.parts[0]}
                    {card.link ? (
                      <>
                        <a href={LEGAL} className="doc__inline-link">
                          {card.link}
                        </a>
                        {card.parts[1]}
                      </>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className="doc-foot__links">
            <a href={HOME}>{c.foot.home}</a>
            <a href={COMPANY_PAGE}>{c.foot.company}</a>
            <a href={LEGAL}>{c.foot.legal}</a>
            <a href={MAILTO}>{c.foot.contact}</a>
            <a href="https://github.com/syncrun-labs" target="_blank" rel="noreferrer">
              {c.foot.github}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
