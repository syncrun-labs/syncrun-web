import type { MetadataRoute } from "next";
import { LEGAL_DOCS } from "@/src/legal/docs";
import { readLegalDoc } from "@/src/legal/read";
import { LANGS, SITE_ORIGIN, langPath } from "@/src/site/config";

// 본문이나 구조화 데이터가 바뀐 페이지의 날짜만 갱신한다.
const PAGES = [
  { path: "/", lastModified: "2026-11-14" },
  { path: "/support", lastModified: "2026-09-16" },
  { path: "/company", lastModified: "2026-09-18" },
  { path: "/account/delete", lastModified: "2026-10-31" },
];

/** 언어 × 페이지 전부. 각 항목이 hreflang 짝을 갖는다. */
export default function sitemap(): MetadataRoute.Sitemap {
  const legalPages = LEGAL_DOCS.map(({ slug }) => {
    const amended = /^\| 최종 개정일 \| (\d{4})년 (\d{1,2})월 (\d{1,2})일 \|$/m.exec(readLegalDoc(slug));
    const lastModified = amended
      ? [amended[1], amended[2].padStart(2, "0"), amended[3].padStart(2, "0")].join("-")
      : undefined;
    return { path: `/legal/${slug}`, lastModified };
  });

  return LANGS.flatMap((lang) =>
    [...PAGES, ...legalPages].map(({ path, lastModified }) => ({
      url: `${SITE_ORIGIN}${langPath(lang, path)}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_ORIGIN}${langPath(l, path)}`])),
      },
    })),
  );
}
