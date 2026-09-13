/**
 * `.lighthouseci/`의 실행 결과를 마크다운 표로 옮긴다.
 *
 * 로컬과 CI가 같은 출력을 쓰도록 워크플로에 스크립트를 박지 않고 파일로 뺐다.
 * 실행이 여러 번이면 URL마다 중앙값을 취한다 — 한 번의 튐이 표를 흔들지 않게 한다.
 *
 *     node scripts/lighthouse-summary.mjs [결과 디렉터리]
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? ".lighthouseci";

/** 점수 구간을 Lighthouse와 같은 기준(0.9 / 0.5)으로 나눈다. */
function badge(score) {
  if (score == null) return "⚪ N/A";
  const value = Math.round(score * 100);
  if (value >= 90) return `🟢 ${value}`;
  if (value >= 50) return `🟡 ${value}`;
  return `🔴 ${value}`;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/** 초 단위가 읽기 쉬운 지표는 초로, 나머지는 밀리초로 적는다. */
function ms(value) {
  if (value == null) return "N/A";
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`;
}

let files;
try {
  files = readdirSync(dir).filter((f) => f.startsWith("lhr-") && f.endsWith(".json"));
} catch {
  console.error(`결과 디렉터리를 찾을 수 없다: ${dir}`);
  process.exit(1);
}

if (!files.length) {
  console.error(`${dir}에 결과가 없다 — 먼저 npm run lighthouse 를 돌린다.`);
  process.exit(1);
}

// URL 하나에 실행이 여럿이므로 경로로 묶는다.
const byPath = new Map();
const redirected = [];
for (const file of files) {
  const lhr = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const requested = new URL(lhr.requestedUrl);
  const final = new URL(lhr.finalDisplayedUrl ?? lhr.requestedUrl);

  // 다른 오리진으로 튕겼으면 우리 사이트를 잰 것이 아니다. Vercel 배포 보호가 켜진 프리뷰는
  // 로그인 페이지로 302를 보내는데, 그 점수를 성공으로 남기면 표 전체가 거짓이 된다.
  if (final.origin !== requested.origin) {
    redirected.push(`${requested.href} → ${final.origin}`);
    continue;
  }

  const path = final.pathname;
  if (!byPath.has(path)) byPath.set(path, []);
  byPath.get(path).push(lhr);
}

if (redirected.length) {
  console.error("측정 대상이 다른 오리진으로 리다이렉트됐다 — 결과를 신뢰할 수 없다:");
  for (const line of new Set(redirected)) console.error(`  ${line}`);
  console.error("배포 보호가 켜진 주소를 겨눴는지 확인한다. 프로덕션은 LHCI_BASE_URL 을 비운다.");
  process.exit(1);
}

const rows = [...byPath.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, runs]) => {
    const pick = (fn) => median(runs.map(fn).filter((v) => v != null));
    const audit = (id) => pick((lhr) => lhr.audits[id]?.numericValue);
    return {
      path,
      perf: pick((lhr) => lhr.categories.performance?.score),
      a11y: pick((lhr) => lhr.categories.accessibility?.score),
      bp: pick((lhr) => lhr.categories["best-practices"]?.score),
      seo: pick((lhr) => lhr.categories.seo?.score),
      lcp: audit("largest-contentful-paint"),
      tbt: audit("total-blocking-time"),
      cls: pick((lhr) => lhr.audits["cumulative-layout-shift"]?.numericValue),
    };
  });

const first = [...byPath.values()][0][0];
const origin = new URL(first.finalDisplayedUrl ?? first.requestedUrl).origin;
const runCount = [...byPath.values()][0].length;

const lines = [
  `**대상**: ${origin} · 모바일 에뮬레이션 · URL당 ${runCount}회 실행의 중앙값`,
  "",
  "| 페이지 | Perf | A11y | BP | SEO | LCP | TBT | CLS |",
  "|---|---|---|---|---|---|---|---|",
  ...rows.map(
    (r) =>
      `| \`${r.path}\` | ${badge(r.perf)} | ${badge(r.a11y)} | ${badge(r.bp)} | ${badge(r.seo)} | ` +
      `${ms(r.lcp)} | ${ms(r.tbt)} | ${r.cls?.toFixed(3) ?? "N/A"} |`,
  ),
];

console.log(lines.join("\n"));
