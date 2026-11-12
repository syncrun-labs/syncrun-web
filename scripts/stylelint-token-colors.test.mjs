import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import stylelint from "stylelint";

const configFile = fileURLToPath(new URL("../.stylelintrc.json", import.meta.url));
const lintFixture = (name) =>
  stylelint.lint({ configFile, files: fileURLToPath(new URL(`./fixtures/${name}.css`, import.meta.url)) });

test("CSS 색 토큰과 허용된 color-mix 인자는 통과한다", async () => {
  const result = await lintFixture("token-colors-valid");
  assert.equal(result.errored, false, result.report);
});

test("색 리터럴, 시스템 색, 허용되지 않은 color-mix 인자는 거부한다", async () => {
  const result = await lintFixture("token-colors-invalid");
  assert.equal(result.errored, true);
  assert.deepEqual(
    result.results[0].warnings.toSorted((a, b) => a.line - b.line).map(({ line, rule }) => [line, rule]),
    [
      [2, "color-no-hex"],
      [3, "color-named"],
      [4, "function-disallowed-list"],
      [5, "function-disallowed-list"],
      [6, "syncrun/token-colors"],
      [7, "syncrun/token-colors"],
      [8, "color-named"],
    ],
  );
});
