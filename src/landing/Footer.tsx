import type { Route } from "next";
import { dict, type Lang } from "../i18n/dict";
import { langPath, type SiteHref, type SitePath } from "../site/config";
import SiteLink from "../ui/SiteLink";
import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import { COMPANY } from "../lib/company";
import { SUPPORT_EMAIL } from "../lib/contact";
import s from "./Footer.module.css";

/** 사이트 경로는 언어 접두를 붙인다. 앵커·외부·mailto는 그대로. */
function resolve(href: SiteHref, lang: Lang) {
  return href.startsWith("/") ? langPath(lang, href as SitePath) : href;
}

export default function Footer({ lang }: { lang: Lang }) {
  const f = dict[lang].footer;
  const c = COMPANY[lang];

  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div>
          <div className={s.logo}>
            <Image src={wordmark} alt="SyncRun" className={s.wordmark} priority />
          </div>
          <p className={s.tag}>{f.tagline}</p>
        </div>

        <nav className={s.cols}>
          {f.cols.map((c) => (
            <div key={c.head} className={s.col}>
              <span className={`mono ${s.head}`}>{c.head}</span>
              {c.links.map((l) => (
                <SiteLink key={l.label} href={resolve(l.href, lang) as Route}>
                  {l.label}
                </SiteLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className={`container ${s.biz}`}>
        <span className={`mono ${s.head}`}>{f.bizHead}</span>
        <p className={s.line}>
          {c.legalName} · {f.bizLabels.ceo} {c.ceo} · {f.bizLabels.bizNo} {c.bizNo}
        </p>
        <p className={s.line}>
          ({c.postalCode}) {c.address}
        </p>
      </div>

      <div className={`container ${s.bottom}`}>
        <span className="mono">{f.rights}</span>
        <a className={s.mailto} href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
