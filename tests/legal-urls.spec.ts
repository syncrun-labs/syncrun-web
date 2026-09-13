import { expect, test } from "@playwright/test";
import { LEGAL_CONTRACT, STORE_URLS } from "./pages";

/**
 * 약관 URL 계약 — 세 주소가 각각 제 문서를 200으로 낸다.
 * App Store Connect의 개인정보 처리방침 URL이자 배포된 앱이 여는 주소라 깨지면 되돌릴 수 없다.
 */
test.describe("약관 URL 계약", () => {
  for (const { path, heading } of LEGAL_CONTRACT) {
    test(`${path} 는 "${heading}" 을 낸다`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} 가 200이어야 한다`).toBe(200);

      await expect(page.locator("article.legal-doc h1")).toHaveText(heading);
      await expect(page.getByRole("tab", { selected: true })).toBeVisible();
    });
  }
});

/** 스토어 메타데이터 주소 — 200 이고 제목이 있다. 로케일 구조를 바꿀 때 이 주소들이 살아 있어야 한다. */
test.describe("스토어 URL 계약", () => {
  for (const path of STORE_URLS) {
    test(`${path} 는 200 이고 h1 이 있다`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} 가 200이어야 한다`).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }
});
