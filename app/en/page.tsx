import App from "@/src/App";
import { dict } from "@/src/i18n/dict";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";
import LandingStructuredData from "@/src/site/LandingStructuredData";

const PATH = "/";
export const metadata = buildMetadata("en", PATH, dict.en.meta);

export default function Page() {
  return (
    <>
      <LandingStructuredData lang="en" />
      <App lang="en" paths={pathPair(PATH)} />
    </>
  );
}
