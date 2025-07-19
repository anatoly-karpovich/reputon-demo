import { APPLICATIONS, TEST_LEVELS, TEST_TYPES } from "data/tags";
import { test, expect } from "fixtures";
import { qase } from "playwright-qase-reporter";

test.describe("[UI] [Google] [Demo Shop]", async () => {
  test(
    "@ID_25 Should open demo shop page",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE] },
    async ({ googleDemoPage }) => {
      qase.id(25);
      await googleDemoPage.open();
      await expect.soft(googleDemoPage.header).toHaveText("Google Reviews by Reputon Demo Store – Shopify App");
      await expect.soft(googleDemoPage.carouselWidget.descritionSection).toBeVisible();
      await expect.soft(googleDemoPage.carouselWidget.contentSection).toBeVisible();
    },
  );
});
