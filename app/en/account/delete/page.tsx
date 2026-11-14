import Account from "@/src/account/Account";
import { accountCopy } from "@/src/i18n/account";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/account/delete";
export const metadata = buildMetadata("en", PATH, accountCopy.en.meta);

export default function Page() {
  return <Account lang="en" paths={pathPair(PATH)} />;
}
