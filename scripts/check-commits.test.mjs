import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("기준 커밋 이후의 일반 커밋을 모두 검사한다", (t) => {
  const cwd = mkdtempSync(join(tmpdir(), "syncrun-check-commits-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  git("init", "-q", "-b", "main");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  git("config", "commit.gpgsign", "false");
  git("config", "core.hooksPath", ".git/hooks");
  git("commit", "-qm", "기존 \u2014 제목", "--allow-empty");
  const base = git("rev-parse", "HEAD");
  const script = fileURLToPath(new URL("./check-commits.mjs", import.meta.url));
  const scan = () => spawnSync(process.execPath, [script, base], { cwd, encoding: "utf8" });

  mkdirSync(join(cwd, "src/legal/docs"), { recursive: true });
  const legal = "src/legal/docs/terms-of-service.md";
  writeFileSync(join(cwd, legal), "약관 사본");
  git("add", legal);
  git("commit", "-qm", "docs(legal): 약관 사본을 동기화한다");
  git("switch", "-qc", "feature");
  git("commit", "-qm", "feat: 가운데점 · 부연", "--allow-empty");
  git("switch", "-q", "main");
  git("merge", "-q", "--no-ff", "-m", "머지 \u2014 제목", "feature");
  assert.equal(scan().status, 0);

  git("commit", "-qm", "feat: 대시 \u2013 부연", "--allow-empty");
  git("rm", "-q", legal);
  git("commit", "-qm", "feat: 약관 사본을 지운다");
  const failed = scan();
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /em dash/);
  assert.match(failed.stderr, /docs\(legal\)/);
});
