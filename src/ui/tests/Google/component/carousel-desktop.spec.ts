import { GoogleMockBuilder } from "data/google-review/googleMockBuilder";
import { GOOGLE_TAGS, APPLICATIONS, TEST_LEVELS, TEST_TYPES } from "data/tags";
import { test, expect } from "fixtures";

test.describe("[UI] [Google] [Demo Shop] [Carousel Widget] [Desktop]", async () => {
  test(
    "Should see correct layout",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleDemoPage }) => {
      const widget = googleDemoPage.carouselWidget;

      await googleDemoPage.open();
      await expect.soft(widget.header, "Verify header is visible").toBeVisible();
      expect.soft(await widget.getHeader(), "Verify header text").toBe("Carousel widget");
      await expect
        .soft(widget.description, "Verify header description text")
        .toHaveText(
          "A sleek, modern slider that fits any store layout. Customize every detail — theme, photo size, scroll behavior, and more — to match your brand perfectly. Effortlessly highlight your best reviews and boost customer trust in one smooth motion.",
        );
      await expect.soft(widget.widgetStyleDropdown, "Verify Widget Style Dropdown is visible").toBeVisible();
      await expect.soft(widget.aiSummaryCard, "Verify AI Summary Card is visible").toBeAttached();
      await expect.soft(widget.previousButton, "Verify Previous is visible").toBeVisible();
      await expect.soft(widget.nextButton, "Verify Next button is visible").toBeVisible();
      await expect.soft(widget.desktopButton, "Verify View Desctop button have correct text").toHaveText("Desktop");
      await expect.soft(widget.mobileButton, "Verify View Mobile button have correct text").toHaveText("Mobile");
      expect
        .soft(await widget.isElementActive(widget.desktopButton), "Verify View Desktop button is active")
        .toBeTruthy();
    },
  );

  test(
    "Should see correct data in AI review card",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleDemoPage, googleMock }) => {
      const widget = googleDemoPage.carouselWidget;
      const mock = new GoogleMockBuilder().addSavedBusiness().setAISummary().setReviewsCount(5).build();
      await googleMock.demoShop(mock);
      const summary = mock.business[0].summary!;
      const expectedData = {
        comment: summary.items.reduce((a, b) => a + "\n" + b, ""),
        name: mock.localization.ai_summary,
        date: `${mock.localization.based_on} ${mock.business[0].reviews.length} ${mock.localization.reviews}`,
      };
      await googleDemoPage.open();
      await expect.soft(widget.aiCardName, "Verify AI card name").toHaveText(expectedData.name);
      await expect.soft(widget.aiCardDate, "Verify AI card date").toHaveText(expectedData.date);
      await expect.soft(widget.aiCardText, "Verify AI card comment").toHaveText(expectedData.comment);
      await expect.soft(widget.aiCardImages, "Verify AI card images count").toHaveCount(4);
    },
  );

  test(
    "Should see correct data in regular review card",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleDemoPage, googleDemoShopPageService, googleMock }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().addReview().build();
      await googleMock.demoShop(mock);

      const { authorName: name, relativeTimeDescription: date, text: comment, images } = mock.business[0].reviews[0];

      await googleDemoPage.open();
      await expect(googleDemoPage.carouselWidget.cardByReviewer(name)).toBeVisible();
      await googleDemoShopPageService.verifyCarouselCardData({
        name,
        date,
        comment,
        imagesCount: images!.length,
      });
    },
  );

  test(
    "Should see correct card data with no text and no images",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoShopPageService, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().addReview(0, { text: false, images: 0 }).build();
      await googleMock.demoShop(mock);

      await googleDemoPage.open();
      const { authorName: name, relativeTimeDescription: date } = mock.business[0].reviews[0];
      await expect(googleDemoPage.carouselWidget.cardByReviewer(name)).toBeVisible();
      await googleDemoShopPageService.verifyCarouselCardData({ name, date, imagesCount: 0 });
    },
  );

  test(
    "Should see correct card data with text and no images",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoShopPageService, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().addReview(0, { text: true, images: 0 }).build();
      await googleMock.demoShop(mock);

      await googleDemoPage.open();
      const { authorName: name, relativeTimeDescription: date, text: comment } = mock.business[0].reviews[0];
      await expect(googleDemoPage.carouselWidget.cardByReviewer(name)).toBeVisible();
      await googleDemoShopPageService.verifyCarouselCardData({ name, date, comment, imagesCount: 0 });
    },
  );

  test(
    "Should see correct card data with no text and 1 image",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoShopPageService, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().addReview(0, { text: false, images: 1 }).build();
      await googleMock.demoShop(mock);

      await googleDemoPage.open();
      const { authorName: name, relativeTimeDescription: date } = mock.business[0].reviews[0];
      await expect(googleDemoPage.carouselWidget.cardByReviewer(name)).toBeVisible();
      await googleDemoShopPageService.verifyCarouselCardData({ name, date, imagesCount: 1 });
    },
  );

  test(
    "Should see correct card after clicking next button",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().setReviewsCount(5).build();
      await googleMock.demoShop(mock);
      const widget = googleDemoPage.carouselWidget;

      await googleDemoPage.open();
      const { authorName: name } = mock.business[0].reviews[4];
      await expect(
        widget.cardByReviewer(name),
        `Verify that card for "${name}" is not in viewport`,
      ).not.toBeInViewport();
      await widget.nextButton.click();
      await expect(
        widget.cardByReviewer(name),
        `Verify that card for "${name}" is in viewport after clicking next button`,
      ).toBeInViewport();
      const { authorName: hiddenName } = mock.business[0].reviews[0];
      await expect(
        widget.cardByReviewer(hiddenName),
        `Verify that card for "${hiddenName}" is not in viewport after clicking next button`,
      ).not.toBeInViewport();
    },
  );

  test(
    "Should see correct card after clicking previous button",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().setReviewsCount(5).build();
      await googleMock.demoShop(mock);
      const widget = googleDemoPage.carouselWidget;

      await googleDemoPage.open();
      const { authorName: name } = mock.business[0].reviews[4];
      await expect(widget.cardByReviewer(name), `Verify that card for "${name}" is in viewport`).not.toBeInViewport();
      await widget.previousButton.click();
      await expect(
        widget.cardByReviewer(name),
        `Verify that card for "${name}" is in viewport after clicking previous button`,
      ).toBeInViewport();
      const { authorName: hiddenName } = mock.business[0].reviews[3];
      await expect(
        widget.cardByReviewer(hiddenName),
        `Verify that card for "${hiddenName}" is not in viewport after clicking previous button`,
      ).not.toBeInViewport();
    },
  );

  test(
    "Should see correct card after swiping to right",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().setReviewsCount(5).build();
      await googleMock.demoShop(mock);

      const widget = googleDemoPage.carouselWidget;

      await googleDemoPage.open();
      const { authorName: hiddenName } = mock.business[0].reviews[3];
      const { authorName: name } = mock.business[0].reviews[4];
      await expect(
        widget.cardByReviewer(name),
        `Verify that card for "${name}" is not in viewport`,
      ).not.toBeInViewport();
      await widget.swipeElement(widget.cardByReviewer(hiddenName), "right");
      await expect(
        widget.cardByReviewer(name),
        `Verify that card for "${name}" is in viewport after swiping to right`,
      ).toBeInViewport();
      await expect(
        widget.cardByReviewer(hiddenName),
        `Verify that card for "${hiddenName}" is not in viewport after swiping to right`,
      ).not.toBeInViewport();
    },
  );

  test(
    "Should see correct card after swiping to left",
    { tag: [TEST_TYPES.UI, TEST_LEVELS.COMPONENT, APPLICATIONS.GOOGLE, GOOGLE_TAGS.CAROUSEL] },
    async ({ googleMock, googleDemoPage }) => {
      const mock = new GoogleMockBuilder().addSavedBusiness().setReviewsCount(5).build();
      await googleMock.demoShop(mock);

      const widget = googleDemoPage.carouselWidget;

      await googleDemoPage.open();

      const { authorName: name } = mock.business[0].reviews[4];
      const { authorName: hiddenName } = mock.business[0].reviews[0];
      await expect(widget.cardByReviewer(name), `Verify that card for "${name}" is in viewport`).not.toBeInViewport();
      await widget.swipeElement(widget.cardByReviewer(mock.business[0].reviews[2].authorName), "left");
      await expect(
        widget.cardByReviewer(name),
        `Verify that card for "${name}" is in viewport after swiping to right`,
      ).toBeInViewport();
      await expect(
        widget.cardByReviewer(hiddenName),
        `Verify that card for "${hiddenName}" is not in viewport after swiping to right`,
      ).not.toBeInViewport();
    },
  );
});
