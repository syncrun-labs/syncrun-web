import Support from "@/src/support/Support";
import { supportCopy } from "@/src/i18n/support";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/support";
export const metadata = buildMetadata("ko", PATH, supportCopy.ko.meta);

export default function Page() {
  return <Support lang="ko" paths={pathPair(PATH)} />;
}
