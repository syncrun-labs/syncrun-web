import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";

/** canonical·hreflang·sitemap·og:url 이 전부 이 오리진을 기준으로 만들어진다. */
export const SITE_ORIGIN = "https://www.syncrunlabs.com";

export const LANGS: Lang[] = ["ko", "en"];

/** ko는 접두가 없다 — App Store Connect에 등록된 기존 경로를 그대로 지키기 위해서다. */
export function langBase(lang: Lang): string {
  return lang === "en" ? "/en" : "";
}

/** 언어별 절대 경로. `path`는 `/support` 처럼 접두 없는 형태로 넘긴다. 랜딩은 `/`. */
export function langPath(lang: Lang, path: string): string {
  const base = langBase(lang);
  if (path === "/") return base || "/";
  return `${base}${path}`;
}

/** 언어 전환 링크가 가리키는 같은 페이지의 두 경로. */
export function pathPair(path: string): LangPaths {
  return { ko: langPath("ko", path), en: langPath("en", path) };
}
