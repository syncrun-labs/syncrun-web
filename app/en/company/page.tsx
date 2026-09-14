import Company from "@/src/company/Company";
import { LangProvider } from "@/src/i18n/lang";
import { companyCopy } from "@/src/i18n/company";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/company";
export const metadata = buildMetadata("en", PATH, companyCopy.en.meta);

export default function Page() {
  return (
    <LangProvider lang="en" paths={pathPair(PATH)}>
      <Company />
    </LangProvider>
  );
}
