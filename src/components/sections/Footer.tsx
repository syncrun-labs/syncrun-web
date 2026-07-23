const COLS = [
  {
    head: "제품",
    links: [
      { label: "작동 방식", href: "#how" },
      { label: "함께 달리기", href: "#onestart" },
      { label: "러닝 카드", href: "#card" },
      { label: "기능", href: "#features" },
    ],
  },
  {
    head: "개발",
    links: [
      { label: "GitHub", href: "https://github.com/syncrun-labs" },
      { label: "iOS 앱", href: "https://github.com/syncrun-labs/syncrun-ios" },
      { label: "백엔드", href: "https://github.com/syncrun-labs/syncrun-server" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
              <circle cx="32" cy="32" r="20" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.4" opacity="0.35" />
              <circle cx="32" cy="32" r="13" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.8" opacity="0.6" />
              <circle cx="32" cy="32" r="5.4" fill="var(--cobalt)" />
            </svg>
            <span>SyncRun</span>
          </div>
          <p className="footer__tag">
            맞대면 그 자리에서 함께 뛰는 러닝 앱.
            <br />
            SwiftUI · Liquid Glass.
          </p>
        </div>

        <nav className="footer__cols">
          {COLS.map((c) => (
            <div key={c.head} className="footer__col">
              <span className="footer__head mono">{c.head}</span>
              {c.links.map((l) => (
                <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="container footer__bottom">
        <span className="mono">© 2026 SyncRun Labs</span>
        <span className="mono">Made with React Bits · Liquid Glass</span>
      </div>
    </footer>
  );
}
