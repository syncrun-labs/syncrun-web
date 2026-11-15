import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";

import LangToggle from "../components/LangToggle";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langBase } from "../site/config";
import { supportCopy } from "../i18n/support";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import d from "../ui/doc.module.css";

const EMAIL = SUPPORT_EMAIL;
const MAILTO = supportMailto("[SyncRun 문의]");

export default function Support({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  const base = langBase(lang);
  const c = supportCopy[lang];
  // 언어별 경로 — ko는 접두 없음, en은 /en
  const HOME = base || "/";
  const LEGAL = `${base}/legal/terms-of-service`;
  const COMPANY_PAGE = `${base}/company`;

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
            <a href={COMPANY_PAGE} className={d["nav-link"]}>
              {c.nav.company}
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
            <span className="doc__kicker">Support</span>
            <h1 className={d.title}>{c.head.title}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
            <p className={`mono ${d.meta}`}>{c.head.requirements}</p>
          </section>

          <section className={`glass ${d.contact}`} id="contact">
            <div>
              <span className={`mono ${d.label}`}>{c.contact.label}</span>
              <a href={MAILTO} className={d.email}>
                {EMAIL}
              </a>
              <p className={d["contact-note"]}>{c.contact.note}</p>
            </div>
            <div className={d["contact-side"]}>
              <span className={`mono ${d.label}`}>{c.contact.sideLabel}</span>
              <ul className={d.list}>
                {c.contact.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={d.section} id="faq">
            <h2 className={`h2 ${d.heading}`}>{c.faq.heading}</h2>
            <div className={d.faq}>
              {c.faq.items.map((item, i) => (
                <article key={item.q} className={d.qa}>
                  <span className={`mono tabular ${d["qa-num"]}`}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className={d["qa-q"]}>{item.q}</h3>
                    {item.a.map((p) => (
                      <p key={p} className={d["qa-a"]}>
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={d.section} id="permissions">
            <h2 className={`h2 ${d.heading}`}>{c.permissions.heading}</h2>
            <p className={d["section-lede"]}>{c.permissions.lede}</p>
            <div className={d.perms}>
              {c.permissions.items.map((p) => (
                <div key={p.name} className={d.perm}>
                  <span className={d["perm-name"]}>{p.name}</span>
                  <p className={d["perm-use"]}>{p.use}</p>
                  <span className={`mono ${d["perm-off"]}`}>{p.off}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={d.section} id="privacy">
            <h2 className={`h2 ${d.heading}`}>{c.account.heading}</h2>
            <div className={d.cols}>
              {c.account.cards.map((card) => (
                <div key={card.h}>
                  <h3 className={d.subheading}>{card.h}</h3>
                  <p className={d.p}>
                    {card.parts[0]}
                    {card.link ? (
                      <>
                        <a href={LEGAL} className={d["inline-link"]}>
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

      <footer className={`doc-foot ${d.foot}`}>
        <div className={`container ${d["foot-inner"]}`}>
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className={d["foot-links"]}>
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
