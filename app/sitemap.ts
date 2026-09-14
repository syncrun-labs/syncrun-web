import type { MetadataRoute } from "next";
import { LEGAL_DOCS } from "@/src/legal/docs";
import { LANGS, SITE_ORIGIN, langPath } from "@/src/site/config";

const PAGES = ["/", "/support", "/company", ...LEGAL_DOCS.map((d) => `/legal/${d.slug}`)];

/** 언어 × 페이지 전부. 각 항목이 hreflang 짝을 갖는다. */
export default function sitemap(): MetadataRoute.Sitemap {
  return LANGS.flatMap((lang) =>
    PAGES.map((path) => ({
      url: `${SITE_ORIGIN}${langPath(lang, path)}`,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_ORIGIN}${langPath(l, path)}`])),
      },
    })),
  );
}
