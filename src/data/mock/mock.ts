import { Page } from "@playwright/test";
import { STATUS_CODES } from "data/api/statusCodes";

export abstract class Mock {
  constructor(private page: Page) {}

  public async modifyReponse<T>(url: string, body: T, status: STATUS_CODES) {
    await this.page.route(url, async (routeForModifications) => {
      // Can be filtered, for example by method like below:
      //
      // if (request.method() === 'POST') {
      //     await route.continue()
      //     return
      // }
      await routeForModifications.fulfill({
        json: body,
        status: status,
      });
    });
  }
}
