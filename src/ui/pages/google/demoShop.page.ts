import { GOOGLE_DEMO_URL } from "config/env";
import { ShopPage } from "ui/pages/shop.page";
import { GoogleCarouselWidget } from "./carousel.widget";
import { logStep } from "utils/reporter/logStep";

export class GoogleDemoPage extends ShopPage {
  readonly header = this.page.locator("span.h2");
  readonly uniqueElement = this.header;

  //widgets
  readonly carouselWidget = new GoogleCarouselWidget(this.page);

  @logStep("Open Google Demo Shop page")
  async open() {
    await this.page.goto(GOOGLE_DEMO_URL);
    await this.waitForOpened();
  }
}
