import test, { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export abstract class ShopPage extends BasePage {
  abstract uniqueElement: Locator;

  async waitForOpened() {
    test.step(`Wait for "${this.constructor.name}" to be opened`, async () => {
      await expect(this.uniqueElement).toBeVisible();
    });
  }
}
