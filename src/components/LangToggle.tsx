"use client";

import { useLang } from "../i18n/lang";
import type { Lang } from "../i18n/dict";

/**
 * KO/EN 전환. 랜딩 Nav와 문서형 페이지(지원·회사 소개·약관)가 같은 것을 쓴다.
 * 상태를 바꾸는 게 아니라 상대 언어의 같은 페이지로 이동하는 링크다 — 언어는 URL이 정한다.
 */
export default function LangToggle() {
  const { lang, paths } = useLang();

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(["ko", "en"] as Lang[]).map((l) => (
        <a
          key={l}
          href={paths[l]}
          hrefLang={l}
          className={`lang-toggle__opt ${lang === l ? "is-active" : ""}`}
          aria-current={lang === l ? "page" : undefined}
        >
          {l === "ko" ? "KO" : "EN"}
        </a>
      ))}
    </div>
  );
}
