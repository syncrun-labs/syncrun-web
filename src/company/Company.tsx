import LangToggle from "../components/LangToggle";
import { companyCopy, type CompanyLink } from "../i18n/company";
import { useLang } from "../i18n/lang";
import { COMPANY } from "../lib/company";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";

const EMAIL = SUPPORT_EMAIL;
const HOME = import.meta.env.BASE_URL;
const WORDMARK = `${HOME}brand/wordmark.png`;

const HREF: Record<CompanyLink | "mailto", string> = {
  home: HOME,
  support: `${HOME}support`,
  legal: `${HOME}legal`,
  github: COMPANY.github,
  mailto: supportMailto("[SyncRun 문의]"),
};

export default function Company() {
  const { lang } = useLang();
  const c = companyCopy[lang];
  const org = COMPANY[lang];
  const mailto = HREF.mailto;

  /* 값은 사업자 정보 상수에서, 라벨은 카피에서 온다 — 숫자가 두 언어로 갈리지 않게. */
  const rows: { k: string; v: string }[] = [
    { k: c.business.labels.name, v: org.legalName },
    { k: c.business.labels.ceo, v: lang === "ko" ? org.ceo : `${org.ceo}, ${org.ceoLabel}` },
    { k: c.business.labels.bizNo, v: org.bizNo },
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
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <img src={WORDMARK} alt="SyncRun" className="doc-nav__wordmark" />
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              {c.nav.home}
            </a>
            <a href={HREF.support} className="doc-nav__link">
              {c.nav.support}
            </a>
            <LangToggle />
            <a href={mailto} className="btn btn-primary doc-nav__cta">
              {c.nav.cta}
            </a>
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <h1 className="doc__title">{org.name}</h1>
            <p className="lede doc__lede">{c.head.lede}</p>
            <p className="doc__meta mono">
              {org.form} · {c.business.labels.ceo} {org.ceo} · {c.business.labels.bizNo} {org.bizNo}
            </p>
          </section>

          <section className="doc__section" id="about">
            <h2 className="h2 doc__h2">{c.about.heading}</h2>
            <p className="doc__section-lede">{c.about.lede}</p>
            <div className="doc__cols">
              {c.about.cards.map((card) => (
                <div key={card.h}>
                  <h3 className="doc__h3">{card.h}</h3>
                  <p className="doc__p">{card.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="doc__section" id="status">
            <h2 className="h2 doc__h2">{c.status.heading}</h2>
            <p className="doc__section-lede">{c.status.lede}</p>
            <div className="doc__faq doc__faq--milestones">
              {c.status.milestones.map((m) => (
                <article key={m.when + m.what} className="doc__qa">
                  <span className="doc__qa-num mono tabular">{m.when}</span>
                  <div className="doc__qa-body">
                    <p className="doc__qa-a">{m.what}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="doc__section" id="stack">
            <h2 className="h2 doc__h2">{c.stack.heading}</h2>
            <p className="doc__section-lede">{c.stack.lede}</p>
            <div className="doc__perms doc__perms--stack">
              {c.stack.items.map((s) => (
                <div key={s.area} className="doc__perm">
                  <span className="doc__perm-name">{s.area}</span>
                  <p className="doc__perm-use">{s.detail}</p>
                </div>
              ))}
            </div>
            <p className="doc__p">
              {c.stack.reposPrefix}
              <a href={COMPANY.github} className="doc__inline-link" target="_blank" rel="noreferrer">
                github.com/syncrun-labs
              </a>
              {c.stack.reposSuffix}
            </p>
          </section>

          <section className="doc__section" id="business">
            <h2 className="h2 doc__h2">{c.business.heading}</h2>
            <p className="doc__section-lede">{c.business.lede}</p>
            <dl className="biz">
              {rows.map((row) => (
                <div key={row.k} className="biz__row">
                  <dt className="biz__k mono">{row.k}</dt>
                  <dd className="biz__v">{row.v}</dd>
                </div>
              ))}
            </dl>
            <p className="doc__p">
              {c.business.notePrefix}
              <a href={`${HREF.legal}#location`} className="doc__inline-link">
                {c.business.noteLink}
              </a>
              {c.business.noteSuffix}
            </p>
          </section>

          <section className="glass doc__contact" id="contact">
            <div className="doc__contact-main">
              <span className="doc__label mono">{c.contact.label}</span>
              <a href={mailto} className="doc__email">
                {EMAIL}
              </a>
              <p className="doc__contact-note">{c.contact.note}</p>
            </div>
            <div className="doc__contact-side">
              <span className="doc__label mono">{c.contact.sideLabel}</span>
              <ul className="doc__list">
                {c.contact.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={HREF[l.to]}
                      className="doc__inline-link"
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

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 {COMPANY.en.name}</span>
          <div className="doc-foot__links">
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
