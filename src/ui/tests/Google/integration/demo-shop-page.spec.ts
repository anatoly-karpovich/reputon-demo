import { STATUS_CODES } from "data/api/statusCodes";
import { GoogleMockBuilder } from "data/google-review/googleMockBuilder";
import { APPLICATIONS, TEST_LEVELS, TEST_TYPES } from "data/tags";
import { test, expect } from "fixtures";

test.describe(
  "[UI] [Google] [Demo Shop] [Invalid API response]",
  { tag: [TEST_TYPES.UI, TEST_LEVELS.INTEGRATION, APPLICATIONS.GOOGLE] },
  async () => {
    const statuses = [STATUS_CODES.INTERNAL_SERVER_ERROR, STATUS_CODES.NOT_FOUND];
    for (const status of statuses) {
      test(`Should open demo shop page with ${status} error`, async ({ googleDemoPage, googleMock }) => {
        const mock = new GoogleMockBuilder().addSavedBusiness().addReview(0, { text: false, images: 0 }).build();
        await googleMock.demoShop(mock, status);

        await googleDemoPage.open();
        await expect
          .soft(googleDemoPage.header, "Verify header text")
          .toHaveText("Google Reviews by Reputon Demo Store – Shopify App");
        await expect
          .soft(googleDemoPage.carouselWidget.descritionSection, 'Verify "Description" section is visible')
          .toBeVisible();
        await expect
          .soft(googleDemoPage.carouselWidget.reviewsContainer, 'Verify "Reviews" section is not visible')
          .not.toBeVisible();
      });
    }
  },
);
