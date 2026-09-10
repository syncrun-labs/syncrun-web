import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/**
 * 시각 회귀·URL 계약 테스트.
 *
 * `reducedMotion: "reduce"`가 렌더를 결정론적으로 만든다 — 리빌 게이팅(`src/lib/reveal.ts`)이
 * 즉시 최종 상태로 건너뛰고, Aurora는 `uTime` 고정 프레임만 그리며, 스냅 스크롤이 꺼져
 * 풀페이지 캡처가 온전히 잡힌다.
 *
 * 언어는 `locale`이 정한다 — `LangProvider`의 `detectLang()`이 `navigator.languages`를 읽고,
 * 새 컨텍스트에는 `localStorage('sr-lang')`가 없어 로케일이 그대로 첫 언어가 된다.
 *
 * 개발 서버가 아니라 프로덕션 빌드(`preview`)를 찍는다 — 비교 대상이 배포 산출물이기 때문이다.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",

  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
  },

  expect: {
    // 폰트 힌팅·안티에일리어싱의 미세한 흔들림은 통과시키고 레이아웃 변화만 잡는다.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", scale: "css" },
  },

  projects: [
    {
      name: "desktop-ko",
      use: { ...devices["Desktop Chrome"], locale: "ko-KR", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-en",
      use: { ...devices["Desktop Chrome"], locale: "en-US", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-ko",
      use: {
        browserName: "chromium",
        locale: "ko-KR",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "mobile-en",
      use: {
        browserName: "chromium",
        locale: "en-US",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],

  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
