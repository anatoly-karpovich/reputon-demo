import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { logStep } from "utils/reporter/logStep";

export abstract class ShopPage extends BasePage {
  abstract uniqueElement: Locator;

  @logStep("Waiting for page to open")
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible();
  }
}
