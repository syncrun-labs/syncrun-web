import Support from "@/src/support/Support";
import { LangProvider } from "@/src/i18n/lang";
import { supportCopy } from "@/src/i18n/support";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/support";
export const metadata = buildMetadata("en", PATH, supportCopy.en.meta);

export default function Page() {
  return (
    <LangProvider lang="en" paths={pathPair(PATH)}>
      <Support />
    </LangProvider>
  );
}
