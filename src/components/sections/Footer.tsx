import { useLang } from "../../i18n/lang";
import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import { COMPANY } from "../../lib/company";
import { SUPPORT_EMAIL } from "../../lib/contact";

/** 지원·약관·회사 소개는 언어별 경로라 접두를 붙인다. 앵커·외부·mailto는 그대로. */
function resolve(href: string, base: string): string {
  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return href;
  return `${base}/${href}`;
}

export default function Footer() {
  const { t, lang, base } = useLang();
  const f = t.footer;
  const c = COMPANY[lang];

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <Image src={wordmark} alt="SyncRun" className="footer__wordmark" priority />
          </div>
          <p className="footer__tag">{f.tagline}</p>
        </div>

        <nav className="footer__cols">
          {f.cols.map((c) => (
            <div key={c.head} className="footer__col">
              <span className="footer__head mono">{c.head}</span>
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

      <div className="container footer__biz">
        <span className="footer__head mono">{f.bizHead}</span>
        <p className="footer__biz-line">
          {c.legalName} · {f.bizLabels.ceo} {c.ceo} · {f.bizLabels.bizNo} {c.bizNo}
        </p>
        <p className="footer__biz-line">
          ({c.postalCode}) {c.address}
        </p>
      </div>

      <div className="container footer__bottom">
        <span className="mono">{f.rights}</span>
        <a className="footer__mailto" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      </div>
    </footer>
  );
}
