import { GoogleDemoShopUIService } from "ui/services/google/demoShop.service";
import { test as base } from "@playwright/test";

interface IPageService {
  googleDemoShopPageService: GoogleDemoShopUIService;
}

export const test = base.extend<IPageService>({
  googleDemoShopPageService: async ({ page }, use) => {
    await use(new GoogleDemoShopUIService(page));
  },
});
