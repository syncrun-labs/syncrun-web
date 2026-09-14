import type { Metadata } from "next";
import type { Lang } from "../i18n/dict";
import type { PageMeta } from "../i18n/lang";
import { SITE_ORIGIN, langPath } from "./config";

/**
 * 페이지 하나의 `metadata`를 만든다.
 *
 * - canonical은 그 언어의 자기 URL이다. 두 언어판이 서로 중복으로 잡히지 않게 한다.
 * - hreflang은 ko·en 짝과 `x-default`를 건다. `x-default`는 ko — 접두 없는 기본 URL이다.
 * - og:image는 리디자인 전까지 브랜드 아이콘을 임시로 건다. `twitter:card`가 `summary_large_image`인데
 *   이미지가 없으면 카드가 깨지므로, 없는 것보다 낫다.
 */
export function buildMetadata(lang: Lang, path: string, meta: PageMeta): Metadata {
  const url = `${SITE_ORIGIN}${langPath(lang, path)}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${SITE_ORIGIN}${langPath("ko", path)}`,
        en: `${SITE_ORIGIN}${langPath("en", path)}`,
        "x-default": `${SITE_ORIGIN}${langPath("ko", path)}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "SyncRun",
      locale: lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: lang === "ko" ? ["en_US"] : ["ko_KR"],
      title: meta.title,
      description: meta.description,
      images: [{ url: `${SITE_ORIGIN}/brand/icon.png`, width: 1024, height: 1024, alt: "SyncRun" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${SITE_ORIGIN}/brand/icon.png`],
    },
  };
}
