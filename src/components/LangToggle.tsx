import { useLang } from "../i18n/lang";
import type { Lang } from "../i18n/dict";

/** KO/EN 전환. 랜딩 Nav와 문서형 페이지(지원·회사 소개·약관)가 같은 것을 쓴다. */
export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(["ko", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
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
