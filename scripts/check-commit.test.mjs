import assert from "node:assert/strict";
import { test } from "node:test";
import { checkCommit } from "./commit-rules.mjs";

test("제목과 본문의 대시를 모두 검사한다", () => {
  assert.equal(checkCommit("docs: 제목 \u2014 부연", []).length, 1);
  assert.equal(checkCommit("docs: 제목\n\n본문 \u2013 부연", []).length, 1);
});

test("주석의 대시와 메시지의 가운데점은 통과한다", () => {
  assert.deepEqual(checkCommit("docs: 제목 · 부연\r\n\r\n# 주석 \u2014 부연", []), []);
});

test("약관 사본을 바꾸면 약관 커밋 제목이 필요하다", () => {
  const files = ["src/legal/docs/terms-of-service.md", "AGENTS.md"];
  assert.equal(checkCommit("feat(legal): 약관을 갱신한다", files).length, 1);
  assert.deepEqual(checkCommit("docs(legal): 약관 사본을 동기화한다", files), []);
  assert.deepEqual(checkCommit("refactor(legal): 화면을 정리한다", ["src/legal/docs.ts"]), []);
});
