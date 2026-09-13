/**
 * Pretendard를 npm 패키지에서 꺼내 사이트가 직접 서빙할 형태로 만든다. `prebuild`·`predev`가 부른다.
 *
 * - woff2 동적 서브셋 92개 → `public/fonts/pretendard/` (git에 넣지 않는다 — 3MB짜리 빌드 산출물이다)
 * - 패키지 CSS → `src/fonts/pretendard.css`, url()을 위 경로로 바꾸고 font-display를 `optional`로.
 *
 * `optional`인 이유: 랜딩의 LCP 요소가 텍스트라, `swap`이면 폰트 도착 시 재도색이 LCP 시점을
 * 폰트 다운로드 뒤로 민다(프로덕션 실측 +2초, #33). `optional`은 폴백으로 먼저 그리고 폰트가
 * 100ms 안에 없으면 이번 방문은 폴백으로 간다 — 재도색이 없어 LCP를 건드리지 않는다.
 * 첫 방문은 시스템 폰트, 재방문부터 캐시된 Pretendard가 쓰인다. `swap`으로 바꾸면 항상 Pretendard지만
 * 그 LCP 비용을 다시 낸다.
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PKG = "node_modules/pretendard/dist/web/variable";
const SRC_CSS = join(PKG, "pretendardvariable-dynamic-subset.css");
const SRC_WOFF = join(PKG, "woff2-dynamic-subset");
const OUT_WOFF = "public/fonts/pretendard";
const OUT_CSS = "src/fonts/pretendard.css";

mkdirSync(OUT_WOFF, { recursive: true });
mkdirSync("src/fonts", { recursive: true });

let copied = 0;
for (const file of readdirSync(SRC_WOFF)) {
  if (!file.endsWith(".woff2")) continue;
  copyFileSync(join(SRC_WOFF, file), join(OUT_WOFF, file));
  copied += 1;
}

const css = readFileSync(SRC_CSS, "utf8")
  .replace(/url\(\.\/woff2-dynamic-subset\//g, "url(/fonts/pretendard/")
  .replace(/font-display:\s*swap/g, "font-display: optional");

writeFileSync(OUT_CSS, `/* 생성 파일 — scripts/prepare-fonts.mjs 가 만든다. 손으로 고치지 않는다. */\n${css}`);

console.log(`Pretendard: woff2 ${copied}개 → ${OUT_WOFF}, CSS → ${OUT_CSS} (font-display: optional)`);
