import { PROJECTS, TEST_LEVELS, TEST_TYPES } from "data/tags";
import { test, expect } from "fixtures";

test.describe("[UI] [Google] [Demo Shop]", async () => {
  test(
    "Should open demo shop page",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, PROJECTS.GOOGLE] },
    async ({ googleDemoPage }) => {
      await googleDemoPage.open();
      await expect.soft(googleDemoPage.header).toHaveText("Google Reviews by Reputon Demo Store – Shopify App");
      await expect.soft(googleDemoPage.carouselWidget.descritionSection).toBeVisible();
      await expect.soft(googleDemoPage.carouselWidget.contentSection).toBeVisible();
    },
  );
});
