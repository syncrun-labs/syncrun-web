"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { dict, type Dict, type Lang } from "./dict";

/** 문서 제목·설명. 페이지마다 다르고, 라우트의 `metadata`가 이 값을 쓴다. */
export interface PageMeta {
  title: string;
  description: string;
}

/** 두 언어의 같은 페이지 경로. 토글은 이 짝을 오간다. */
export interface LangPaths {
  ko: string;
  en: string;
}

interface LangCtx {
  lang: Lang;
  t: Dict;
  paths: LangPaths;
  /** 이 언어의 경로 접두 — ko는 "", en은 "/en". 내부 링크는 `${base}/support` 처럼 만든다. */
  base: string;
}

const Ctx = createContext<LangCtx | null>(null);

/**
 * 언어는 URL이 정한다 — `/`가 ko, `/en`이 en. 각 라우트가 자기 `lang`과 두 언어의 경로 짝을 넘긴다.
 * 브라우저 로케일 감지나 저장된 선택은 없다. 그래야 URL 하나에 내용 하나가 고정되어
 * 검색엔진이 언어판을 구분하고, 정적 생성 결과가 방문자마다 같다.
 */
export function LangProvider({
  lang,
  paths,
  children,
}: {
  lang: Lang;
  paths: LangPaths;
  children: ReactNode;
}) {
  const value = useMemo<LangCtx>(
    () => ({ lang, t: dict[lang], paths, base: lang === "en" ? "/en" : "" }),
    [lang, paths],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
