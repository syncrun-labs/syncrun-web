import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langBase } from "../site/config";
import { supportCopy } from "../i18n/support";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import d from "../ui/doc.module.css";
import { ContactBox, DocFooter, DocHeader, DocSection } from "../ui/Doc";

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
      <DocHeader
        home={HOME}
        links={[
          { href: HOME, label: c.nav.home },
          { href: COMPANY_PAGE, label: c.nav.company },
        ]}
        lang={lang}
        paths={paths}
        cta={{ href: MAILTO, label: c.nav.cta }}
      />

      <main className={d.doc}>
        <div className="container">
          <section className={d.head}>
            <span className="doc__kicker">Support</span>
            <h1 className={d.title}>{c.head.title}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
            <p className={`mono ${d.meta}`}>{c.head.requirements}</p>
          </section>

          <ContactBox
            id="contact"
            label={c.contact.label}
            email={EMAIL}
            href={MAILTO}
            note={c.contact.note}
            sideLabel={c.contact.sideLabel}
          >
            {c.contact.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ContactBox>

          <DocSection id="faq" heading={c.faq.heading}>
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
          </DocSection>

          <DocSection id="permissions" heading={c.permissions.heading} lede={c.permissions.lede}>
            <div className={d.perms}>
              {c.permissions.items.map((p) => (
                <div key={p.name} className={d.perm}>
                  <span className={d["perm-name"]}>{p.name}</span>
                  <p className={d["perm-use"]}>{p.use}</p>
                  <span className={`mono ${d["perm-off"]}`}>{p.off}</span>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="privacy" heading={c.account.heading}>
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
          </DocSection>
        </div>
      </main>

      <DocFooter
        owner="SyncRun Labs"
        links={[
          { href: HOME, label: c.foot.home },
          { href: COMPANY_PAGE, label: c.foot.company },
          { href: LEGAL, label: c.foot.legal },
          { href: MAILTO, label: c.foot.contact },
          { href: "https://github.com/syncrun-labs", label: c.foot.github, external: true },
        ]}
      />
    </>
  );
}
