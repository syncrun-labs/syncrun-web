import CrewJoin from "@/src/crew/CrewJoin";
import { LangProvider } from "@/src/i18n/lang";
import { crewJoinCopy } from "@/src/i18n/crewJoin";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

const PATH = "/crew/join";
// 초대 링크는 사람마다 건네는 주소라 검색에 잡히지 않는다.
export const metadata = { ...buildMetadata("ko", PATH, crewJoinCopy.ko.meta), robots: { index: false, follow: false } };

export default function Page() {
  return (
    <LangProvider lang="ko" paths={pathPair(PATH)}>
      <CrewJoin />
    </LangProvider>
  );
}
