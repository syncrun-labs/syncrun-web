import Account from "@/src/account/Account";
import { accountCopy } from "@/src/i18n/account";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/account/delete";
export const metadata = buildMetadata("ko", PATH, accountCopy.ko.meta);

export default function Page() {
  return <Account lang="ko" paths={pathPair(PATH)} />;
}
