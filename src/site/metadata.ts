import type { Metadata } from "next";
import type { Lang } from "../i18n/dict";
import type { PageMeta } from "../i18n/lang";
import { SITE_ORIGIN, langPath } from "./config";

/**
 * 페이지 하나의 `metadata`를 만든다.
 *
 * - canonical은 그 언어의 자기 URL이다. 두 언어판이 서로 중복으로 잡히지 않게 한다.
 * - hreflang은 ko·en 짝과 접두 없는 기본 URL인 `x-default`를 건다.
 * - 랜딩과 크루 초대는 각 경로의 `opengraph-image.tsx`가 공유 이미지를 공급한다.
 */
export function buildMetadata(lang: Lang, path: string, meta: PageMeta): Metadata {
  const url = `${SITE_ORIGIN}${langPath(lang, path)}`;
  const hasShareImage = path === "/" || path === "/crew/join";
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
      ...(!hasShareImage && { images: [{ url: "/brand/icon.png", width: 1024, height: 1024, alt: "SyncRun" }] }),
    },
    twitter: {
      card: hasShareImage ? "summary_large_image" : "summary",
      title: meta.title,
      description: meta.description,
    },
  };
}
