import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";

import LangToggle from "../components/LangToggle";
import { accountCopy } from "../i18n/account";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langBase } from "../site/config";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import d from "../ui/doc.module.css";

const EMAIL = SUPPORT_EMAIL;
const MAILTO = supportMailto("[SyncRun 문의]");

export default function Account({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  const base = langBase(lang);
  const c = accountCopy[lang];
  // 언어별 경로 — ko는 접두 없음, en은 /en
  const HOME = base || "/";
  const SUPPORT = `${base}/support`;
  const LEGAL = `${base}/legal/terms-of-service`;
  const PRIVACY = `${base}/legal/privacy-policy`;
  const DELETE_MAILTO = supportMailto(c.email.mailSubject);

  return (
    <>
      <header className={`doc-nav ${d.nav}`}>
        <div className={`container ${d["nav-inner"]}`}>
          <a href={HOME} className={d["nav-brand"]}>
            <Image src={wordmark} alt="SyncRun" className={d["nav-wordmark"]} priority />
          </a>
          <div className={d["nav-actions"]}>
            <a href={HOME} className={d["nav-link"]}>
              {c.nav.home}
            </a>
            <a href={SUPPORT} className={d["nav-link"]}>
              {c.nav.support}
            </a>
            <LangToggle lang={lang} paths={paths} />
            <a href={MAILTO} className={`btn btn-primary ${d["nav-cta"]}`}>
              {c.nav.cta}
            </a>
          </div>
        </div>
      </header>

      <main className={d.doc}>
        <div className="container">
          <section className={d.head}>
            <h1 className={d.title}>{c.head.title}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
          </section>

          <section className={d.section} id="in-app">
            <h2 className={`h2 ${d.heading}`}>{c.inApp.heading}</h2>
            <p className={d["section-lede"]}>{c.inApp.lede}</p>
            <ol className={`${d.faq} ${d.steps}`}>
              {c.inApp.steps.map((step, i) => (
                <li key={step} className={d.qa}>
                  <span className={`mono tabular ${d["qa-num"]}`}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className={d["qa-a"]}>{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={d.section} id="deleted">
            <h2 className={`h2 ${d.heading}`}>{c.deleted.heading}</h2>
            <p className={d["section-lede"]}>{c.deleted.lede}</p>
            <div className={d.cols}>
              {c.deleted.cols.map((col) => (
                <div key={col.h}>
                  <h3 className={d.subheading}>{col.h}</h3>
                  {col.items ? (
                    <ul className={`${d.list} ${d.compact}`}>
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className={d.p}>{col.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={d.section} id="device">
            <h2 className={`h2 ${d.heading}`}>{c.device.heading}</h2>
            <p className={d["section-lede"]}>{c.device.lede}</p>
            <div className={d.cols}>
              {c.device.cols.map((col) => (
                <div key={col.h}>
                  <h3 className={d.subheading}>{col.h}</h3>
                  <p className={d.p}>{col.p}</p>
                </div>
              ))}
            </div>
          </section>

          {[
            { id: "subscription", copy: c.subscription },
            { id: "records", copy: c.records },
          ].map(({ id, copy }) => (
            <section key={id} className={d.section} id={id}>
              <h2 className={`h2 ${d.heading}`}>{copy.heading}</h2>
              <p className={d["section-lede"]}>{copy.lede}</p>
              <div className={d.cols}>
                {copy.cols.map((col) => (
                  <div key={col.h}>
                    <h3 className={d.subheading}>{col.h}</h3>
                    <p className={d.p}>{col.p}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className={d.section} id="email">
            <h2 className={`h2 ${d.heading}`}>{c.email.heading}</h2>
            <p className={d["section-lede"]}>{c.email.lede}</p>
            <div className={`glass ${d.contact}`}>
              <div>
                <span className={`mono ${d.label}`}>{c.email.label}</span>
                <a href={DELETE_MAILTO} className={d.email}>
                  {EMAIL}
                </a>
                <p className={d["contact-note"]}>
                  {c.email.notePrefix}
                  <a href={PRIVACY} className={d["inline-link"]}>
                    {c.email.noteLink}
                  </a>
                  {c.email.noteSuffix}
                </p>
              </div>
              <div className={d["contact-side"]}>
                <span className={`mono ${d.label}`}>{c.email.sideLabel}</span>
                <ul className={d.list}>
                  {c.email.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className={d.section} id="contact">
            <h2 className={`h2 ${d.heading}`}>{c.contact.heading}</h2>
            <p className={d["section-lede"]}>
              {c.contact.prefix}
              <a href={SUPPORT} className={d["inline-link"]}>
                {c.contact.link}
              </a>
              {c.contact.suffix}
            </p>
          </section>
        </div>
      </main>

      <footer className={`doc-foot ${d.foot}`}>
        <div className={`container ${d["foot-inner"]}`}>
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className={d["foot-links"]}>
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
