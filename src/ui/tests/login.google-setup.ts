import { expect, test as setup } from "@playwright/test";

const authFile = "src/.auth/google-login.json";

setup("Should login to Google Shop with valid credentials", async function ({ page, context }) {
  await page.goto(
    "https://apps.shopify.com/google-reviews-trust-badge?surface_intra_position=1&surface_type=partners&surface_version=redesign",
  );
  const [newPage] = await Promise.all([context.waitForEvent("page"), page.getByText("View demo store").click()]);

  await newPage.waitForLoadState();
  await expect(newPage.locator(".reputon-switch").first()).toBeVisible();
  await page.context().storageState({ path: authFile });
});
