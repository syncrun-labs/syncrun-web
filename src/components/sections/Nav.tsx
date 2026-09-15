import Image from "next/image";
import wordmark from "@/public/brand/wordmark.png";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../../i18n/lang";
import LangToggle from "../LangToggle";
import { APP_STORE_URL } from "../../lib/app-store";

export default function Nav() {
  const { t } = useLang();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const links = [
    { label: t.nav.bump, href: "#bump" },
    { label: t.nav.oneStart, href: "#onestart" },
    { label: t.nav.card, href: "#card" },
    { label: t.nav.features, href: "#features" },
  ];

  return (
    <header className="nav">
      <motion.span className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="nav__inner container">
        <div className="nav__bar">
          <a href="#top" className="nav__brand" aria-label="SyncRun">
            <Image src={wordmark} alt="SyncRun" className="nav__wordmark" priority />
          </a>

          <nav className="nav__links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <LangToggle />
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary nav__cta">
              {t.nav.cta}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
