import js from "@eslint/js";
import globals from "globals";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next", "dist", "test-results", "playwright-report", "tests/__screenshots__", "next-env.d.ts"],
  },
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
  // Next 자체 규칙(next/image·next/link·폰트 등). `eslint-config-next` 전체는 아직 ESLint 10과 맞지 않아
  // (동봉된 eslint-plugin-react가 제거된 API를 쓴다) Next 플러그인만 직접 얹는다.
  nextPlugin.configs["core-web-vitals"],
  // 라우트 파일은 규약상 metadata·generateStaticParams 같은 값을 컴포넌트와 함께 export 한다.
  // 그건 Fast Refresh 문제가 아니라 App Router 규약이라 이 규칙을 끈다.
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  // 설정·테스트·스크립트는 Node에서 돈다.
  {
    files: ["*.config.{ts,js,mjs,cjs}", "tests/**/*.ts", "scripts/**/*.mjs"],
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
