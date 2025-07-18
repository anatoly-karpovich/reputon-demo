import { expect, Locator, Page } from "@playwright/test";
import { logStep } from "utils/reporter/logStep";

export abstract class BaseUIService {
  constructor(protected page: Page) {}

  @logStep("Check elements in viewport")
  async checkElementsInViewport(locators: Locator[], toBeInViewport = true) {
    await Promise.allSettled(
      locators.map((locator) =>
        toBeInViewport
          ? expect.soft(locator, "Element should be in viewport").toBeInViewport()
          : expect.soft(locator, "Element should not be in viewport").not.toBeInViewport(),
      ),
    );
  }
}
