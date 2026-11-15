import { dict, type Lang } from "../i18n/dict";
import { langBase } from "../site/config";
import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import { COMPANY } from "../lib/company";
import { SUPPORT_EMAIL } from "../lib/contact";
import s from "./Footer.module.css";

/** 지원·약관·회사 소개는 언어별 경로라 접두를 붙인다. 앵커·외부·mailto는 그대로. */
function resolve(href: string, base: string): string {
  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return href;
  return `${base}/${href}`;
}

export default function Footer({ lang }: { lang: Lang }) {
  const base = langBase(lang);
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
              {c.links.map((l) => {
                const href = resolve(l.href, base);
                const external = href.startsWith("http");
                return (
                  <a
                    key={l.label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                  >
                    {l.label}
                  </a>
                );
              })}
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
