import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const nextRulesStart = "<!-- BEGIN:nextjs-agent-rules -->";
const nextRulesEnd = "<!-- END:nextjs-agent-rules -->";
const pathEscapes = { a: "\x07", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t", v: "\v" };

function destinationPath(header) {
  const path = header.slice(4).replace(/\t$/u, "");
  if (!path.startsWith('"')) return path;
  return path.slice(1, -1).replace(/\\([abfnrtv"\\])/gu, (_, key) => pathEscapes[key] ?? key);
}

export function findAddedDashes(patch, agents) {
  const agentLines = agents.split(/\r?\n/);
  const start = agentLines.indexOf(nextRulesStart) + 1;
  const end = agentLines.indexOf(nextRulesEnd, start) + 1;
  const violations = [];
  let file;
  let lineNumber;

  for (const line of patch.split("\n")) {
    if (line.startsWith("diff --git ")) {
      file = undefined;
      lineNumber = undefined;
    } else if (lineNumber === undefined && line.startsWith("+++ ")) {
      file = destinationPath(line);
    } else if (line.startsWith("@@ ")) {
      lineNumber = Number(/^@@ -\d+(?:,\d+)? \+(\d+)/u.exec(line)[1]);
    } else if (file && lineNumber !== undefined && /^[+ ]/u.test(line)) {
      const generatedRules = file === "AGENTS.md" && start > 0 && lineNumber > start && lineNumber < end;
      const excluded = generatedRules || file.startsWith("src/legal/docs/");
      if (line.startsWith("+") && !excluded && /[\u2013\u2014]/u.test(line)) {
        violations.push(`${file}:${lineNumber}`);
      }
      lineNumber++;
    }
  }

  return violations;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = process.argv[2];
  if (!base) {
    console.error("기준 커밋을 지정해 주세요. node scripts/check-dashes.mjs <base>");
    process.exit(1);
  }

  const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  const options = ["--no-ext-diff", "--no-textconv", "--no-color", "--no-prefix", "-U0"];
  const patch = git("-c", "core.quotePath=false", "diff", ...options, `${base}...HEAD`, "--");
  const agents = git("ls-tree", "--name-only", "HEAD", "--", "AGENTS.md") ? git("show", "HEAD:AGENTS.md") : "";
  const violations = findAddedDashes(patch, agents);

  if (violations.length) {
    console.error("추가된 줄에 em dash 또는 en dash가 있습니다. 가운데점(·), 쉼표, 물결표(~)로 바꿔 주세요.");
    console.error(violations.join("\n"));
    process.exitCode = 1;
  }
}
