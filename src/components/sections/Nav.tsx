import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../../i18n/lang";
import type { Lang } from "../../i18n/dict";

const WORDMARK = `${import.meta.env.BASE_URL}brand/wordmark.png`;

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const [condensed, setCondensed] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t.nav.how, href: "#onestart" },
    { label: t.nav.card, href: "#card" },
    { label: t.nav.activity, href: "#activity" },
    { label: t.nav.features, href: "#features" },
  ];

  return (
    <header className={`nav ${condensed ? "nav--condensed" : ""}`}>
      <motion.span className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="nav__inner container">
        <div className="nav__bar">
          <a href="#top" className="nav__brand" aria-label="SyncRun">
            <img src={WORDMARK} alt="SyncRun" className="nav__wordmark" />
          </a>

          <nav className="nav__links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <LangToggle lang={lang} setLang={setLang} />
            <a href="#download" className="btn btn-primary nav__cta">
              {t.nav.cta}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(["ko", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          className={`lang-toggle__opt ${lang === l ? "is-active" : ""}`}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
        >
          {l === "ko" ? "KO" : "EN"}
        </button>
      ))}
    </div>
  );
}
