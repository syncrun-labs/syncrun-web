import assert from "node:assert/strict";
import { test } from "node:test";
import { findAddedDashes } from "./check-dashes.mjs";

test("삭제되거나 유지되는 줄, 바이너리, 약관 사본은 제외한다", () => {
  const patch = [
    "diff --git 설명.md 설명.md",
    "+++ 설명.md",
    "@@ -1,2 +1,2 @@",
    " 기존 \u2014 문장",
    "-삭제된 \u2013 문장",
    "+새 문장 · 부연",
    "diff --git asset.png asset.png",
    "Binary files asset.png and asset.png differ",
    "diff --git src/legal/docs/a.md src/legal/docs/a.md",
    "+++ src/legal/docs/a.md",
    "@@ -1 +1 @@",
    "-이전 문장",
    "+사본 \u2014 문장",
  ].join("\n");
  assert.deepEqual(findAddedDashes(patch, ""), []);
});

test("Next.js 블록 바깥에 추가된 대시를 파일과 줄 번호로 보고한다", () => {
  const agents = "제목\n<!-- BEGIN:nextjs-agent-rules -->\n생성 줄\n<!-- END:nextjs-agent-rules -->\n외부 줄";
  const patch = [
    "diff --git AGENTS.md AGENTS.md",
    "+++ AGENTS.md",
    "@@ -2,0 +3 @@",
    "+생성 \u2013 줄",
    "@@ -3,0 +5 @@",
    "+외부 \u2014 줄",
    'diff --git "a\\tb.md" "a\\tb.md"',
    '+++ "a\\tb.md"',
    "@@ -0,0 +1,2 @@",
    "+첫 \u2013 줄",
    "++++ 두 번째 \u2014 줄",
  ].join("\n");
  assert.deepEqual(findAddedDashes(patch, agents), ["AGENTS.md:5", "a\tb.md:1", "a\tb.md:2"]);
});
