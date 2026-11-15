import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";

import LangToggle from "../components/LangToggle";
import { companyCopy, type CompanyLink } from "../i18n/company";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langBase } from "../site/config";
import { COMPANY } from "../lib/company";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import d from "../ui/doc.module.css";
import biz from "./Company.module.css";

const EMAIL = SUPPORT_EMAIL;

/** 언어별 경로 — ko는 접두 없음, en은 /en. 외부·mailto는 언어와 무관. */
function hrefFor(base: string): Record<CompanyLink | "mailto", string> {
  return {
    home: base || "/",
    support: `${base}/support`,
    legal: `${base}/legal/terms-of-service`,
    github: COMPANY.github,
    mailto: supportMailto("[SyncRun 문의]"),
  };
}

export default function Company({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  const base = langBase(lang);
  const HREF = hrefFor(base);
  const HOME = HREF.home;
  const c = companyCopy[lang];
  const org = COMPANY[lang];
  const mailto = HREF.mailto;

  /* 값은 사업자 정보 상수에서, 라벨은 카피에서 온다 — 숫자가 두 언어로 갈리지 않게. */
  const rows: { k: string; v: string }[] = [
    { k: c.business.labels.name, v: org.legalName },
    { k: c.business.labels.ceo, v: lang === "ko" ? org.ceo : `${org.ceo}, ${org.ceoLabel}` },
    { k: c.business.labels.bizNo, v: org.bizNo },
    { k: c.business.labels.lbsFilingNo, v: org.lbsFilingNo },
    {
      k: c.business.labels.address,
      v: lang === "ko" ? `(${org.postalCode}) ${org.address}` : `${org.address} ${org.postalCode}`,
    },
    { k: c.business.labels.industry, v: org.industry },
    { k: c.business.labels.form, v: `${org.form} · ${org.founded}` },
    { k: c.business.labels.contact, v: EMAIL },
  ];

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
            <a href={HREF.support} className={d["nav-link"]}>
              {c.nav.support}
            </a>
            <LangToggle lang={lang} paths={paths} />
            <a href={mailto} className={`btn btn-primary ${d["nav-cta"]}`}>
              {c.nav.cta}
            </a>
          </div>
        </div>
      </header>

      <main className={d.doc}>
        <div className="container">
          <section className={d.head}>
            <h1 className={d.title}>{org.name}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
            <p className={`mono ${d.meta}`}>
              {org.form} · {c.business.labels.ceo} {org.ceo} · {c.business.labels.bizNo} {org.bizNo}
            </p>
          </section>

          <section className={d.section} id="about">
            <h2 className={`h2 ${d.heading}`}>{c.about.heading}</h2>
            <p className={d["section-lede"]}>{c.about.lede}</p>
            <div className={d.cols}>
              {c.about.cards.map((card) => (
                <div key={card.h}>
                  <h3 className={d.subheading}>{card.h}</h3>
                  <p className={d.p}>{card.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={d.section} id="status">
            <h2 className={`h2 ${d.heading}`}>{c.status.heading}</h2>
            <p className={d["section-lede"]}>{c.status.lede}</p>
            <div className={`${d.faq} ${d.milestones}`}>
              {c.status.milestones.map((m) => (
                <article key={m.when + m.what} className={d.qa}>
                  <span className={`mono tabular ${d["qa-num"]}`}>{m.when}</span>
                  <div>
                    <p className={d["qa-a"]}>{m.what}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={d.section} id="stack">
            <h2 className={`h2 ${d.heading}`}>{c.stack.heading}</h2>
            <p className={d["section-lede"]}>{c.stack.lede}</p>
            <div className={`${d.perms} ${d.stack}`}>
              {c.stack.items.map((s) => (
                <div key={s.area} className={d.perm}>
                  <span className={d["perm-name"]}>{s.area}</span>
                  <p className={d["perm-use"]}>{s.detail}</p>
                </div>
              ))}
            </div>
            <p className={d.p}>
              {c.stack.reposPrefix}
              <a href={COMPANY.github} className={d["inline-link"]} target="_blank" rel="noreferrer">
                github.com/syncrun-labs
              </a>
              {c.stack.reposSuffix}
            </p>
          </section>

          <section className={d.section} id="business">
            <h2 className={`h2 ${d.heading}`}>{c.business.heading}</h2>
            <p className={d["section-lede"]}>{c.business.lede}</p>
            <dl className={biz.biz}>
              {rows.map((row) => (
                <div key={row.k} className={biz.row}>
                  <dt className={`mono ${biz.key}`}>{row.k}</dt>
                  <dd className={biz.value}>{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className={d.p}>
              {c.business.notePrefix}
              <a href={`${base}/legal/location-terms`} className={d["inline-link"]}>
                {c.business.noteLink}
              </a>
              {c.business.noteSuffix}
            </p>
          </section>

          <section className={`glass ${d.contact}`} id="contact">
            <div>
              <span className={`mono ${d.label}`}>{c.contact.label}</span>
              <a href={mailto} className={d.email}>
                {EMAIL}
              </a>
              <p className={d["contact-note"]}>{c.contact.note}</p>
            </div>
            <div className={d["contact-side"]}>
              <span className={`mono ${d.label}`}>{c.contact.sideLabel}</span>
              <ul className={d.list}>
                {c.contact.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={HREF[l.to]}
                      className={d["inline-link"]}
                      target={l.to === "github" ? "_blank" : undefined}
                      rel={l.to === "github" ? "noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className={`doc-foot ${d.foot}`}>
        <div className={`container ${d["foot-inner"]}`}>
          <span className="mono">© 2026 {COMPANY.en.name}</span>
          <div className={d["foot-links"]}>
            {c.foot.map((l) => (
              <a key={l.label} href={HREF[l.to]}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
