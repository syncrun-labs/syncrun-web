import Company from "@/src/company/Company";
import { companyCopy } from "@/src/i18n/company";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/company";
export const metadata = buildMetadata("ko", PATH, companyCopy.ko.meta);

export default function Page() {
  return <Company lang="ko" paths={pathPair(PATH)} />;
}
