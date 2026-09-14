import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { LegalDocSlug } from "./docs";

/**
 * 약관 원문을 빌드 타임에 읽는다. 서버 컴포넌트에서만 부르므로 마크다운이 클라이언트 번들에
 * 들어가지 않는다. `src/legal/docs/*.md`는 syncrun 허브 `legal/`의 사본이고 `sync.sh`가 맞춘다.
 */
export function readLegalDoc(slug: LegalDocSlug): string {
  return readFileSync(join(process.cwd(), "src/legal/docs", `${slug}.md`), "utf8");
}
