import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Lang } from "@/src/i18n/dict";
import type { LegalDocSlug } from "./docs";

/**
 * 약관 원문을 빌드 타임에 읽는다. 서버 컴포넌트에서만 부르므로 마크다운이 클라이언트 번들에
 * 들어가지 않는다. `src/legal/docs/*.md`는 syncrun 허브 `legal/`의 사본이고 `sync.sh`가 맞춘다.
 *
 * 한국어가 정본이고 영어는 편의 번역이다(`*.en.md`). 영어로 읽는 이용자가 한국어 전문에
 * 동의하게 두지 않으려고 언어별로 다른 파일을 낸다 — 정본이 바뀐다는 뜻은 아니다.
 */
export function readLegalDoc(slug: LegalDocSlug, lang: Lang = "ko"): string {
  const name = lang === "en" ? `${slug}.en.md` : `${slug}.md`;
  return readFileSync(join(process.cwd(), "src/legal/docs", name), "utf8");
}
