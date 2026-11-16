import { companyCopy, type CompanyLink } from "../i18n/company";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import type { Route } from "next";
import { langPath } from "../site/config";
import SiteLink from "../ui/SiteLink";
import { COMPANY } from "../lib/company";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import d from "../ui/doc.module.css";
import biz from "./Company.module.css";
import { ContactBox, DocFooter, DocHeader, DocSection } from "../ui/Doc";

const EMAIL = SUPPORT_EMAIL;

/** 언어별 경로. 외부·mailto는 언어와 무관. */
function hrefFor(lang: Lang): Record<CompanyLink | "mailto", Route> {
  return {
    home: langPath(lang, "/"),
    support: langPath(lang, "/support"),
    legal: langPath(lang, "/legal/terms-of-service"),
    github: COMPANY.github,
    mailto: supportMailto("[SyncRun 문의]"),
  };
}

export default function Company({ lang, paths }: { lang: Lang; paths: LangPaths }) {
  const HREF = hrefFor(lang);
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
      <DocHeader
        home={HOME}
        links={[
          { href: HOME, label: c.nav.home },
          { href: HREF.support, label: c.nav.support },
        ]}
        lang={lang}
        paths={paths}
        cta={{ href: mailto, label: c.nav.cta }}
      />

      <main className={d.doc}>
        <div className="container">
          <section className={d.head}>
            <h1 className={d.title}>{org.name}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
            <p className={`mono ${d.meta}`}>
              {org.form} · {c.business.labels.ceo} {org.ceo} · {c.business.labels.bizNo} {org.bizNo}
            </p>
          </section>

          <DocSection id="about" heading={c.about.heading} lede={c.about.lede}>
            <div className={d.cols}>
              {c.about.cards.map((card) => (
                <div key={card.h}>
                  <h3 className={d.subheading}>{card.h}</h3>
                  <p className={d.p}>{card.p}</p>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="status" heading={c.status.heading} lede={c.status.lede}>
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
          </DocSection>

          <DocSection id="stack" heading={c.stack.heading} lede={c.stack.lede}>
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
          </DocSection>

          <DocSection id="business" heading={c.business.heading} lede={c.business.lede}>
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
              <SiteLink href={langPath(lang, "/legal/location-terms")} className={d["inline-link"]}>
                {c.business.noteLink}
              </SiteLink>
              {c.business.noteSuffix}
            </p>
          </DocSection>

          <ContactBox
            id="contact"
            label={c.contact.label}
            email={EMAIL}
            href={mailto}
            note={c.contact.note}
            sideLabel={c.contact.sideLabel}
          >
            {c.contact.links.map((l) => (
              <li key={l.label}>
                <SiteLink href={HREF[l.to]} className={d["inline-link"]}>
                  {l.label}
                </SiteLink>
              </li>
            ))}
          </ContactBox>
        </div>
      </main>

      <DocFooter owner={COMPANY.en.name} links={c.foot.map((l) => ({ href: HREF[l.to], label: l.label }))} />
    </>
  );
}
