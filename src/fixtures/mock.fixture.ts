import { test as base } from "@playwright/test";
import { GooglePagesMock } from "data/mock/google.mock";

interface Mock {
  googleMock: GooglePagesMock;
}

export const test = base.extend<Mock>({
  googleMock: async ({ page }, use) => {
    await use(new GooglePagesMock(page));
  },
});
