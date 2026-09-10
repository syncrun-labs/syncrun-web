import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "test-results", "playwright-report", "tests/__screenshots__"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  // 설정·테스트는 Node에서 돈다.
  {
    files: ["*.config.{ts,js}", "tests/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  /**
   * React Bits(reactbits.dev)에서 가져와 다듬은 장식 컴포넌트 층.
   * 최신 훅 규칙이 짚는 것들(렌더 중 ref 갱신, 일회성 읽기의 useMemo, 이펙트 안 setState)은
   * 동작 결함이 아니라 관용구라, 지금 고치면 멀쩡한 애니메이션을 건드리게 된다.
   * 경고로 두어 보이게는 하되 막지는 않는다. 정리는 리디자인에서 이 층을 다시 볼 때 함께 한다.
   */
  {
    files: ["src/components/reactbits/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // 서식은 Prettier가 정한다 — 겹치는 ESLint 규칙을 끈다. 항상 마지막에 온다.
  prettier,
);
