import { GoogleDemoPage } from "ui/pages/google/demoShop.page";
import { test as base } from "@playwright/test";

interface IGooglePages {
  googleDemoPage: GoogleDemoPage;
}

export const test = base.extend<IGooglePages>({
  googleDemoPage: async ({ page }, use) => {
    await use(new GoogleDemoPage(page));
  },
});
