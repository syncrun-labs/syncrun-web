import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { langOf, localized, PAGES } from "./pages";

for (const { path } of PAGES) {
  test(`${path}의 명도 대비와 터치 영역을 검사한다`, async ({ page }, testInfo) => {
    const url = localized(path, langOf(testInfo.project.name));
    const response = await page.goto(url);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);

    const { violations } = await new AxeBuilder({ page }).withRules(["color-contrast", "target-size"]).analyze();
    const failures = violations.map(({ id, nodes }) => ({
      rule: id,
      elements: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    }));
    expect(failures).toEqual([]);
  });
}
