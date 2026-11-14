import App from "@/src/App";
import { dict } from "@/src/i18n/dict";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";
import LandingStructuredData from "@/src/site/LandingStructuredData";

const PATH = "/";
export const metadata = buildMetadata("ko", PATH, dict.ko.meta);

export default function Page() {
  return (
    <>
      <LandingStructuredData lang="ko" />
      <App lang="ko" paths={pathPair(PATH)} />
    </>
  );
}
