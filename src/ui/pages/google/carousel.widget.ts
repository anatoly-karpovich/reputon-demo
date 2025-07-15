import { GoogleWidget } from "./google.widget";

export class GoogleCarouselWidget extends GoogleWidget {
  readonly descritionSection = this.page.locator("section.shopify-section").nth(0);
  readonly header = this.descritionSection.locator("h2");
  readonly description = this.descritionSection.locator("p");
  readonly contentSection = this.page.locator("section").nth(1);
  readonly reviewsContainer = this.contentSection.locator(".reputon-carousel");
  readonly desktopButton = this.contentSection.locator(`button[data-type="desktop"]`);
  readonly mobileButton = this.contentSection.locator(`button[data-type="mobile"]`);
  readonly uniqueElement = this.page.locator('[data-type="carousel"]').nth(0);
  readonly widgetStyleDropdown = this.contentSection.locator(`[data-widget="carousel"]`);

  //swiper
  readonly nextButton = this.contentSection.locator(".reputon-swiper-button-next:visible");
  readonly previousButton = this.contentSection.locator(".reputon-swiper-button-prev:visible");
  //ai review card
  readonly aiSummaryCard = this.contentSection.locator(".reputon-summary-review .reputon-top-part");
  readonly aiCardName = this.aiSummaryCard.locator(".reputon-name");
  readonly aiCardText = this.aiSummaryCard.locator(".reputon-text");
  readonly aiCardDate = this.aiSummaryCard.locator(".reputon-date");
  readonly aiCardImages = this.aiSummaryCard.locator(".reputon-grid-review-images img");

  //regular review card
  readonly card = this.contentSection.locator(
    "div.reputon-single-review:not(.reputon-summary-review) .reputon-top-part",
  );
  readonly cardByReviewer = (name: string) => this.card.filter({ hasText: name });
  readonly cardName = (name: string) => this.cardByReviewer(name).locator(".reputon-name a");
  readonly cardDate = (name: string) => this.cardByReviewer(name).locator(".reputon-date");
  readonly cardText = (name: string) => this.cardByReviewer(name).locator(".reputon-text");
  readonly cardImages = (name: string) => this.cardByReviewer(name).locator(".reputon-grid-review-images img");
  readonly cardShowMoreButton = (name: string) => this.cardByReviewer(name).locator(".reputon-show-more");
  readonly cardVerifiedIcon = (name: string) => this.cardByReviewer(name).locator(".reputon-verified");
  readonly cardVerifiedLabel = (name: string) => this.cardVerifiedIcon(name).locator("div");

  async getAIReviewCardData() {
    const [name, date, comment, images] = await Promise.all([
      this.aiCardName.innerText(),
      this.aiCardDate.innerText(),
      this.aiCardText.innerText(),
      this.aiCardImages.all(),
    ]);

    return {
      name,
      date,
      comment: comment?.replaceAll("\n", ""),
      images: images.length,
    };
  }

  async getCardData(reviewerName: string) {
    let comment = "";
    if (await this.cardText(reviewerName).isVisible()) {
      comment = await this.cardText(reviewerName).innerText();
    }
    const [name, date, images] = await Promise.all([
      this.cardName(reviewerName).innerText(),
      this.cardDate(reviewerName).innerText(),
      this.cardImages(reviewerName).all(),
    ]);

    return {
      name,
      date,
      comment: comment,
      images: images.length,
    };
  }
}
