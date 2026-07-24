import { useLang } from "../../i18n/lang";

const BASE = import.meta.env.BASE_URL;
const WORDMARK = `${BASE}brand/wordmark.png`;

/** 지원/약관은 별도 HTML 페이지라 BASE_URL을 붙인다. 앵커·외부·mailto는 그대로. */
function resolve(href: string): string {
  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return href;
  return `${BASE}${href}`;
}

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={WORDMARK} alt="SyncRun" className="footer__wordmark" />
          </div>
          <p className="footer__tag">{f.tagline}</p>
        </div>

        <nav className="footer__cols">
          {f.cols.map((c) => (
            <div key={c.head} className="footer__col">
              <span className="footer__head mono">{c.head}</span>
              {c.links.map((l) => {
                const href = resolve(l.href);
                const external = href.startsWith("http");
                return (
                  <a key={l.label} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                    {l.label}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="container footer__bottom">
        <span className="mono">{f.rights}</span>
        <a className="footer__mailto" href="mailto:sjsb4838@gmail.com">sjsb4838@gmail.com</a>
      </div>
    </footer>
  );
}
