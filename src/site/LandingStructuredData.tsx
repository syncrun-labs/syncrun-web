import { dict, type Lang } from "../i18n/dict";
import { appStoreUrl } from "../lib/app-store";
import { COMPANY } from "../lib/company";
import { langPath, SITE_ORIGIN } from "./config";

export default function LandingStructuredData({ lang }: { lang: Lang }) {
  const storeUrl = appStoreUrl(lang);
  const organizationId = `${SITE_ORIGIN}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: COMPANY[lang].name,
        legalName: COMPANY[lang].legalName,
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/brand/icon.png`,
        sameAs: [COMPANY.github],
      },
      {
        "@type": "MobileApplication",
        "@id": `${SITE_ORIGIN}/#app`,
        name: "SyncRun",
        url: `${SITE_ORIGIN}${langPath(lang, "/")}`,
        description: dict[lang].meta.description,
        inLanguage: lang,
        applicationCategory: "HealthApplication",
        operatingSystem: "iOS 18.0+",
        installUrl: storeUrl,
        offers: { "@type": "Offer", price: 0, url: storeUrl },
        publisher: { "@id": organizationId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
