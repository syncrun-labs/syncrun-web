"use client";

import "../styles/support.css";
import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import "../styles/account.css";

import LangToggle from "../components/LangToggle";
import { accountCopy } from "../i18n/account";
import { useLang } from "../i18n/lang";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";

const EMAIL = SUPPORT_EMAIL;
const MAILTO = supportMailto("[SyncRun 문의]");

export default function Account() {
  const { lang, base } = useLang();
  const c = accountCopy[lang];
  // 언어별 경로 — ko는 접두 없음, en은 /en
  const HOME = base || "/";
  const SUPPORT = `${base}/support`;
  const LEGAL = `${base}/legal/terms-of-service`;
  const PRIVACY = `${base}/legal/privacy-policy`;
  const DELETE_MAILTO = supportMailto(c.email.mailSubject);

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
            <h1 className="doc__title">{c.head.title}</h1>
            <p className="lede doc__lede">{c.head.lede}</p>
          </section>

          <section className="doc__section" id="in-app">
            <h2 className="h2 doc__h2">{c.inApp.heading}</h2>
            <p className="doc__section-lede">{c.inApp.lede}</p>
            <ol className="doc__faq doc__faq--steps">
              {c.inApp.steps.map((step, i) => (
                <li key={step} className="doc__qa">
                  <span className="doc__qa-num mono tabular">{String(i + 1).padStart(2, "0")}</span>
                  <div className="doc__qa-body">
                    <p className="doc__qa-a">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="doc__section" id="deleted">
            <h2 className="h2 doc__h2">{c.deleted.heading}</h2>
            <p className="doc__section-lede">{c.deleted.lede}</p>
            <div className="doc__cols">
              {c.deleted.cols.map((col) => (
                <div key={col.h}>
                  <h3 className="doc__h3">{col.h}</h3>
                  {col.items ? (
                    <ul className="doc__list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="doc__p">{col.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="doc__section" id="device">
            <h2 className="h2 doc__h2">{c.device.heading}</h2>
            <p className="doc__section-lede">{c.device.lede}</p>
            <div className="doc__cols">
              {c.device.cols.map((col) => (
                <div key={col.h}>
                  <h3 className="doc__h3">{col.h}</h3>
                  <p className="doc__p">{col.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="doc__section" id="email">
            <h2 className="h2 doc__h2">{c.email.heading}</h2>
            <p className="doc__section-lede">{c.email.lede}</p>
            <div className="glass doc__contact">
              <div className="doc__contact-main">
                <span className="doc__label mono">{c.email.label}</span>
                <a href={DELETE_MAILTO} className="doc__email">
                  {EMAIL}
                </a>
                <p className="doc__contact-note">
                  {c.email.notePrefix}
                  <a href={PRIVACY} className="doc__inline-link">
                    {c.email.noteLink}
                  </a>
                  {c.email.noteSuffix}
                </p>
              </div>
              <div className="doc__contact-side">
                <span className="doc__label mono">{c.email.sideLabel}</span>
                <ul className="doc__list">
                  {c.email.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="doc__section" id="contact">
            <h2 className="h2 doc__h2">{c.contact.heading}</h2>
            <p className="doc__section-lede">
              {c.contact.prefix}
              <a href={SUPPORT} className="doc__inline-link">
                {c.contact.link}
              </a>
              {c.contact.suffix}
            </p>
          </section>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className="doc-foot__links">
            <a href={HOME}>{c.foot.home}</a>
            <a href={SUPPORT}>{c.foot.support}</a>
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
