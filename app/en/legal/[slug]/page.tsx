import { notFound } from "next/navigation";
import Legal from "@/src/legal/Legal";
import { LEGAL_DOCS, docBySlug } from "@/src/legal/docs";
import { readLegalDoc } from "@/src/legal/read";
import { LangProvider } from "@/src/i18n/lang";
import { legalCopy } from "@/src/i18n/legal";
import { buildMetadata } from "@/src/site/metadata";
import { pathPair } from "@/src/site/config";

type Params = { slug: string };

/** 세 슬러그를 전부 열거해 빌드 타임에 정적 페이지로 만든다. */
export function generateStaticParams(): Params[] {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) notFound();
  const base = legalCopy.en.meta;
  // 문서마다 제목을 달리해 세 페이지가 검색엔진에 서로 다른 문서로 잡히게 한다.
  // 공통 제목의 부제(" — 이용약관 · …")는 문서명과 겹치므로 뗀다.
  return buildMetadata("en", `/legal/${slug}`, {
    title: `${legalCopy.en.tabs[doc.key]} — ${base.title.split(" — ")[0]}`,
    description: base.description,
  });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) notFound();
  return (
    <LangProvider lang="en" paths={pathPair(`/legal/${slug}`)}>
      <Legal active={doc.key} source={readLegalDoc(doc.slug)} />
    </LangProvider>
  );
}
