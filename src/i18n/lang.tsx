import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { dict, type Dict, type Lang } from "./dict";

const STORAGE_KEY = "sr-lang";

/** 첫 진입 언어 결정 — 저장된 선택 > 브라우저 로케일. 한국어를 하드 기본값으로 두지 않는다:
 *  navigator.languages에 한국어가 있을 때만 ko, 그 외는 모두 en. */
function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ko" || saved === "en") return saved;
  } catch {
    /* localStorage 접근 불가(프라이빗 모드 등) — 로케일 감지로 넘어간다 */
  }
  const locales =
    navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  return locales.some((l) => l && l.toLowerCase().startsWith("ko")) ? "ko" : "en";
}

interface LangCtx {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* 저장 불가면 세션 내 상태만 유지 */
    }
  }, []);

  const toggle = useCallback(() => setLang(lang === "ko" ? "en" : "ko"), [lang, setLang]);

  const t = dict[lang];

  // <html lang>·문서 제목·메타 설명을 현재 언어에 맞춘다(SPA라 클라이언트에서 갱신).
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const value = useMemo<LangCtx>(() => ({ lang, t, setLang, toggle }), [lang, t, setLang, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
