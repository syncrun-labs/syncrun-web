import { useEffect, useState } from "react";
import Magnet from "../reactbits/Magnet";

const LINKS = [
  { label: "작동 방식", href: "#how" },
  { label: "함께 달리기", href: "#onestart" },
  { label: "러닝 카드", href: "#card" },
  { label: "기능", href: "#features" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand">
          <svg className="nav__mark" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="20" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.4" opacity="0.35" />
            <circle cx="32" cy="32" r="13" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.8" opacity="0.6" />
            <circle cx="32" cy="32" r="5.4" fill="var(--cobalt)" />
          </svg>
          <span>SyncRun</span>
        </a>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <Magnet strength={0.25} radius={90}>
          <a href="#download" className="btn btn-primary nav__cta">
            App Store
          </a>
        </Magnet>
      </div>
    </header>
  );
}
