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
