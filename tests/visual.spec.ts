import { expect, test, type Page } from "@playwright/test";
import { PAGES } from "./pages";

/**
 * 페이지 끝까지 훑어 `loading="lazy"` 이미지를 불러온 뒤 맨 위로 돌아온다.
 * 풀페이지 캡처는 뷰포트 밖도 찍으므로, 훑지 않으면 지연 이미지가 빈 자리로 남는다.
 * 리빌 게이팅과 스크롤 구동 틸트는 reduced-motion에서 이미 꺼져 있어 스크롤이 그림을 바꾸지 않는다.
 */
async function loadLazyImages(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    }
    window.scrollTo(0, 0);
  });

  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0));
}

/**
 * 시각 회귀 — 페이지 전체를 찍어 기준 이미지와 비교한다.
 * 기준 이미지는 `tests/__screenshots__/<프로젝트>/`에 있고, `--update-snapshots`로 갱신한다.
 */
test.describe("시각 회귀", () => {
  for (const { name, path } of PAGES) {
    test(name, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      // 웹폰트(Pretendard)가 들어온 뒤에 찍는다 — 레이아웃이 그 뒤에 확정된다.
      await page.evaluate(() => document.fonts.ready);
      await loadLazyImages(page);

      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    });
  }
});
