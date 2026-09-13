import type { ReactNode } from "react";
import RootHtml from "@/src/site/RootHtml";

export { viewport } from "@/src/site/viewport";
export { iconsMetadata as metadata } from "@/src/site/icons";

export default function Layout({ children }: { children: ReactNode }) {
  return <RootHtml lang="ko">{children}</RootHtml>;
}
