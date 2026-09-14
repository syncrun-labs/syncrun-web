import "../index.css";

import type { ReactNode } from "react";
import type { Lang } from "../i18n/dict";

/**
 * 두 루트 레이아웃(`app/(ko)`·`app/en`)이 공유하는 문서 껍데기.
 * `<html lang>`이 언어마다 달라야 해서 레이아웃이 둘인데, 그 안은 같아야 하므로 여기 모은다.
 * `html:lang(ko)` 자간 규칙(`index.css`)이 이 속성을 본다.
 */
export default function RootHtml({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
