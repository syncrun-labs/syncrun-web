import { useEffect, useState } from "react";
import Markdown from "./Markdown";
import termsSrc from "./docs/terms-of-service.md?raw";
import privacySrc from "./docs/privacy-policy.md?raw";
import locationSrc from "./docs/location-terms.md?raw";
import LangToggle from "../components/LangToggle";
import { useLang } from "../i18n/lang";
import { legalCopy } from "../i18n/legal";
import { SUPPORT_EMAIL, supportMailto } from "../lib/contact";

const HOME = import.meta.env.BASE_URL;
const MAILTO = supportMailto("[SyncRun 문의]");
const WORDMARK = `${HOME}brand/wordmark.png`;

// 본문은 번역하지 않는다 — 약관 3종은 한국어가 정본이고 앱이 동의를 받는 것도 이 문서다.
const DOCS = [
  { key: "terms", source: termsSrc },
  { key: "privacy", source: privacySrc },
  { key: "location", source: locationSrc },
] as const;

type DocKey = (typeof DOCS)[number]["key"];

// 문서별 공개 URL 슬러그 — App Store Connect 개인정보 URL과 앱의 약관 링크가 이 경로(`/legal/<슬러그>`)를 가리킨다.
const SLUG: Record<DocKey, string> = {
  terms: "terms-of-service",
  privacy: "privacy-policy",
  location: "location-terms",
};
const KEY_BY_SLUG: Record<string, DocKey> = {
  "terms-of-service": "terms",
  "privacy-policy": "privacy",
  "location-terms": "location",
};

// 경로(`/legal/privacy-policy`) 우선, 없으면 레거시 해시(`/legal#privacy`) 폴백으로 표시할 문서를 고른다.
function keyFromLocation(): DocKey {
  if (typeof window === "undefined") return "terms";
  const slug = window.location.pathname.replace(/\/+$/, "").split("/").pop() ?? "";
  if (KEY_BY_SLUG[slug]) return KEY_BY_SLUG[slug];
  const hash = window.location.hash.replace("#", "");
  return DOCS.some((doc) => doc.key === hash) ? (hash as DocKey) : "terms";
}

export default function Legal() {
  const { lang } = useLang();
  const c = legalCopy[lang];
  const [active, setActive] = useState<DocKey>(keyFromLocation);

  useEffect(() => {
    const sync = () => setActive(keyFromLocation());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const select = (key: DocKey) => {
    setActive(key);
    const path = `${HOME}legal/${SLUG[key]}`;
    if (window.location.pathname !== path) {
      history.replaceState(null, "", path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doc = DOCS.find((item) => item.key === active) ?? DOCS[0];

  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <img src={WORDMARK} alt="SyncRun" className="doc-nav__wordmark" />
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              {c.nav.home}
            </a>
            <a href={`${HOME}support`} className="doc-nav__link">
              {c.nav.support}
            </a>
            <LangToggle />
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <span className="eyebrow">Legal</span>
            <h1 className="doc__title">{c.head.title}</h1>
            <p className="lede doc__lede">{c.head.lede}</p>
          </section>

          {c.notice ? (
            <aside className="legal-notice">
              {c.notice.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                {c.notice.askPrefix}
                <a href={MAILTO} className="doc__inline-link">
                  {SUPPORT_EMAIL}
                </a>
                {c.notice.askMiddle}
                <a href={`${HOME}company`} className="doc__inline-link">
                  {c.notice.askLink}
                </a>
                {c.notice.askSuffix}
              </p>
            </aside>
          ) : null}

          <div className="legal-tabs" role="tablist" aria-label={c.tabsLabel}>
            {DOCS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={item.key === active}
                className={`legal-tab${item.key === active ? " is-active" : ""}`}
                onClick={() => select(item.key)}
              >
                {c.tabs[item.key]}
              </button>
            ))}
          </div>

          <article className="legal-doc">
            <Markdown source={doc.source} />
          </article>
        </div>
      </main>

      <footer className="doc-foot">
        <div className="container doc-foot__inner">
          <span className="mono">© 2026 SyncRun Labs</span>
          <div className="doc-foot__links">
            <a href={HOME}>{c.foot.home}</a>
            <a href={`${HOME}company`}>{c.foot.company}</a>
            <a href={`${HOME}support`}>{c.foot.support}</a>
            <a href={MAILTO}>{c.foot.contact}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
