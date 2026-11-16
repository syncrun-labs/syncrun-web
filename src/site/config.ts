import type { Route } from "next";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import type { LegalDocSlug } from "../legal/docs";

/** 사이트 안 경로(접두 없는 형태)·앵커·mailto·바깥 주소. 약관은 동적 세그먼트라 슬러그 목록으로 좁힌다. */
export type SiteHref = Route | `/legal/${LegalDocSlug}`;

/**
 * 접두 없는 사이트 경로. 실제 라우트만 들어오므로 없는 경로는 타입 검사에서 막힌다.
 * 언어 접두는 `langPath`가 붙이므로 `/en…`은 받지 않고, 영어판이 없는 운영 사이트(`/admin`)도 뺀다.
 */
export type SitePath = Exclude<Extract<SiteHref, `/${string}`>, `/en${string}` | `/admin${string}`>;

/** canonical·hreflang·sitemap·og:url 이 전부 이 오리진을 기준으로 만들어진다. */
export const SITE_ORIGIN = "https://www.syncrunlabs.com";

export const LANGS: Lang[] = ["ko", "en"];

/** ko는 접두가 없다 — App Store Connect에 등록된 기존 경로를 그대로 지키기 위해서다. */
export function langBase(lang: Lang): string {
  return lang === "en" ? "/en" : "";
}

/**
 * 언어별 절대 경로. `path`는 `/support` 처럼 접두 없는 형태로 넘긴다. 랜딩은 `/`.
 * 영어판은 같은 구조라 `/en` 접두를 붙인 값도 라우트다.
 */
export function langPath(lang: Lang, path: SitePath): Route {
  const base = langBase(lang);
  if (path === "/") return (base || "/") as Route;
  return `${base}${path}` as Route;
}

/** 언어 전환 링크가 가리키는 같은 페이지의 두 경로. */
export function pathPair(path: SitePath): LangPaths {
  return { ko: langPath("ko", path), en: langPath("en", path) };
}
