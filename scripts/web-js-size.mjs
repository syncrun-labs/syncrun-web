import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const [worktree = ".", ...requestedPaths] = process.argv.slice(2);
const buildDir = join(worktree, ".next");
const publicPaths = [
  "/",
  "/support",
  "/company",
  "/account/delete",
  "/legal/terms-of-service",
  "/legal/privacy-policy",
  "/legal/location-terms",
  "/crew/join",
];
const paths = requestedPaths.length
  ? requestedPaths
  : [...publicPaths, ...publicPaths.map((path) => (path === "/" ? "/en" : `/en${path}`))];

const kib = (bytes) => (bytes / 1024).toFixed(1);
const gzipSize = (content) => gzipSync(content, { level: 9 }).length;

try {
  const rows = paths.map((path) => {
    const htmlPath = path === "/" ? "index.html" : `${path.slice(1)}.html`;
    const html = readFileSync(join(buildDir, "server/app", htmlPath));
    const scripts = new Set(
      Array.from(
        html.toString("utf8").matchAll(/<script\b[^>]*\ssrc=["']\/_next\/(static\/[^"'?]+\.js)(?:\?[^"']*)?["']/gi),
        ([, src]) => src,
      ),
    );

    let jsBytes = 0;
    let jsGzipBytes = 0;
    for (const src of scripts) {
      const script = readFileSync(join(buildDir, src));
      jsBytes += script.length;
      jsGzipBytes += gzipSize(script);
    }

    return `| \`${path}\` | ${scripts.size} | ${kib(jsBytes)} | ${kib(jsGzipBytes)} | ${kib(html.length)} | ${kib(gzipSize(html))} |`;
  });

  console.log(
    [
      "| 페이지 | JS 파일 수 | JS 원본 (KiB) | JS gzip (KiB) | HTML 원본 (KiB) | HTML gzip (KiB) |",
      "|---|---:|---:|---:|---:|---:|",
      ...rows,
    ].join("\n"),
  );
} catch (error) {
  console.error("프로덕션 빌드 경로와 측정할 페이지를 확인하세요.");
  console.error(error.message);
  process.exitCode = 1;
}
