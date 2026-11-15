import { accountCopy } from "../i18n/account";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import { langBase } from "../site/config";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";
import d from "../ui/doc.module.css";
import { ContactBox, DocFooter, DocHeader, DocSection } from "../ui/Doc";

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
      <DocHeader
        home={HOME}
        links={[
          { href: HOME, label: c.nav.home },
          { href: SUPPORT, label: c.nav.support },
        ]}
        lang={lang}
        paths={paths}
        cta={{ href: MAILTO, label: c.nav.cta }}
      />

      <main className={d.doc}>
        <div className="container">
          <section className={d.head}>
            <h1 className={d.title}>{c.head.title}</h1>
            <p className={`lede ${d.lede}`}>{c.head.lede}</p>
          </section>

          <DocSection id="in-app" heading={c.inApp.heading} lede={c.inApp.lede}>
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
          </DocSection>

          <DocSection id="deleted" heading={c.deleted.heading} lede={c.deleted.lede}>
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
          </DocSection>

          <DocSection id="device" heading={c.device.heading} lede={c.device.lede}>
            <div className={d.cols}>
              {c.device.cols.map((col) => (
                <div key={col.h}>
                  <h3 className={d.subheading}>{col.h}</h3>
                  <p className={d.p}>{col.p}</p>
                </div>
              ))}
            </div>
          </DocSection>

          {[
            { id: "subscription", copy: c.subscription },
            { id: "records", copy: c.records },
          ].map(({ id, copy }) => (
            <DocSection key={id} id={id} heading={copy.heading} lede={copy.lede}>
              <div className={d.cols}>
                {copy.cols.map((col) => (
                  <div key={col.h}>
                    <h3 className={d.subheading}>{col.h}</h3>
                    <p className={d.p}>{col.p}</p>
                  </div>
                ))}
              </div>
            </DocSection>
          ))}

          <DocSection id="email" heading={c.email.heading} lede={c.email.lede}>
            <ContactBox
              as="div"
              label={c.email.label}
              email={EMAIL}
              href={DELETE_MAILTO}
              note={
                <>
                  {c.email.notePrefix}
                  <a href={PRIVACY} className={d["inline-link"]}>
                    {c.email.noteLink}
                  </a>
                  {c.email.noteSuffix}
                </>
              }
              sideLabel={c.email.sideLabel}
            >
              {c.email.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ContactBox>
          </DocSection>

          <DocSection
            id="contact"
            heading={c.contact.heading}
            lede={
              <>
                {c.contact.prefix}
                <a href={SUPPORT} className={d["inline-link"]}>
                  {c.contact.link}
                </a>
                {c.contact.suffix}
              </>
            }
          />
        </div>
      </main>

      <DocFooter
        owner="SyncRun Labs"
        links={[
          { href: HOME, label: c.foot.home },
          { href: SUPPORT, label: c.foot.support },
          { href: LEGAL, label: c.foot.legal },
          { href: MAILTO, label: c.foot.contact },
          { href: "https://github.com/syncrun-labs", label: c.foot.github, external: true },
        ]}
      />
    </>
  );
}
