import { Locator } from "@playwright/test";
import { ShopPage } from "../shop.page";
import { logStep } from "utils/reporter/logStep";

type ViewButton = "Mobile" | "Desktop";

export abstract class GoogleWidget extends ShopPage {
  abstract readonly descritionSection: Locator;
  abstract readonly header: Locator;
  abstract readonly description: Locator;
  abstract readonly contentSection: Locator;
  abstract readonly reviewsContainer: Locator;
  abstract readonly desktopButton: Locator;
  abstract readonly mobileButton: Locator;
  abstract readonly widgetStyleDropdown: Locator;

  @logStep("Click view button")
  async clickViewButton(button: ViewButton) {
    const viewButtons = this.getViewButtons();
    await viewButtons[button].click();
  }

  @logStep("Open Widget Style Preview dropdown")
  async openStyleDropdown() {
    await this.widgetStyleDropdown.click();
  }

  async isViewButtonSelected(button: ViewButton) {
    const viewButtons = this.getViewButtons();
    return await this.isElementActive(viewButtons[button]);
  }

  async getHeader() {
    return (await this.header.textContent())?.trim();
  }

  async getDescription() {
    return await this.description.textContent();
  }

  private getViewButtons() {
    return {
      Mobile: this.mobileButton,
      Desktop: this.desktopButton,
    };
  }
}
