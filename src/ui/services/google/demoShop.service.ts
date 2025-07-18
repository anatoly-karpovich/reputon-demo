import { GoogleDemoPage } from "ui/pages/google/demoShop.page";
import { BaseUIService } from "../base.service";
import { expect } from "fixtures";
import { logStep } from "utils/reporter/logStep";

export class GoogleDemoShopUIService extends BaseUIService {
  private shopPage = new GoogleDemoPage(this.page);

  async open() {
    await this.shopPage.open();
  }

  @logStep("Verify correct review card data in carousel widget")
  async verifyCarouselCardData({
    name,
    date,
    comment,
    imagesCount,
  }: {
    name: string;
    date: string;
    comment?: string;
    imagesCount: number;
  }) {
    await Promise.all([
      expect.soft(this.shopPage.carouselWidget.cardName(name), "Should see correct card name").toHaveText(name),
      expect.soft(this.shopPage.carouselWidget.cardDate(name), "Should see correct card date").toHaveText(date),
      expect
        .soft(this.shopPage.carouselWidget.cardImages(name), "Should see correct card images")
        .toHaveCount(imagesCount),
      comment
        ? expect
            .soft(this.shopPage.carouselWidget.cardText(name), "Should see correct card comment")
            .toHaveText(comment)
        : expect.soft(this.shopPage.carouselWidget.cardText(name), "Should not see card comment").not.toBeVisible(),
    ]);
  }
}
