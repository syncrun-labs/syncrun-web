import { useEffect, useState } from "react";
import Markdown from "./Markdown";
import termsSrc from "./docs/terms-of-service.md?raw";
import privacySrc from "./docs/privacy-policy.md?raw";
import locationSrc from "./docs/location-terms.md?raw";

const HOME = import.meta.env.BASE_URL;
const MAILTO = `mailto:sjsb4838@gmail.com?subject=${encodeURIComponent("[SyncRun 문의]")}`;

const DOCS = [
  { key: "terms", tab: "이용약관", source: termsSrc },
  { key: "privacy", tab: "개인정보 처리방침", source: privacySrc },
  { key: "location", tab: "위치기반서비스", source: locationSrc },
] as const;

type DocKey = (typeof DOCS)[number]["key"];

function keyFromHash(): DocKey {
  const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
  return DOCS.some((doc) => doc.key === hash) ? (hash as DocKey) : "terms";
}

export default function Legal() {
  const [active, setActive] = useState<DocKey>(keyFromHash);

  useEffect(() => {
    const onHashChange = () => {
      const key = window.location.hash.replace("#", "");
      if (DOCS.some((doc) => doc.key === key)) setActive(key as DocKey);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const select = (key: DocKey) => {
    setActive(key);
    if (window.location.hash.replace("#", "") !== key) {
      history.replaceState(null, "", `#${key}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doc = DOCS.find((item) => item.key === active) ?? DOCS[0];

  return (
    <>
      <header className="doc-nav">
        <div className="container doc-nav__inner">
          <a href={HOME} className="doc-nav__brand">
            <svg viewBox="0 0 64 64" width="24" height="24" aria-hidden="true">
              <circle cx="32" cy="32" r="20" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.4" opacity="0.35" />
              <circle cx="32" cy="32" r="13" fill="none" stroke="var(--cobalt-bright)" strokeWidth="2.8" opacity="0.6" />
              <circle cx="32" cy="32" r="5.4" fill="var(--cobalt)" />
            </svg>
            <span>SyncRun</span>
          </a>
          <div className="doc-nav__actions">
            <a href={HOME} className="doc-nav__link">
              홈
            </a>
            <a href={`${HOME}support`} className="doc-nav__link">
              지원
            </a>
          </div>
        </div>
      </header>

      <main className="doc">
        <div className="container">
          <section className="doc__head">
            <span className="eyebrow">Legal</span>
            <h1 className="doc__title">약관 및 정책</h1>
            <p className="lede doc__lede">
              싱크런(SyncRun)의 이용약관과 개인정보·위치정보 처리 방침 전문입니다. 앱 첫 실행의 동의 화면과 &lsquo;나&rsquo;
              탭에서도 같은 내용을 볼 수 있습니다.
            </p>
          </section>

          <div className="legal-tabs" role="tablist" aria-label="약관 문서">
            {DOCS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={item.key === active}
                className={`legal-tab${item.key === active ? " is-active" : ""}`}
                onClick={() => select(item.key)}
              >
                {item.tab}
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
            <a href={HOME}>홈</a>
            <a href={`${HOME}support`}>지원</a>
            <a href={MAILTO}>문의</a>
          </div>
        </div>
      </footer>
    </>
  );
}
