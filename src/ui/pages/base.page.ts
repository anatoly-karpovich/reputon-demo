import test, { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async isElementActive(element: Locator) {
    return (await element.getAttribute("class"))?.includes("active");
  }

  async interceptResponse<U extends object | null, T extends unknown[]>(
    url: string,
    triggerAction: (...args: T) => Promise<void>,
    ...args: T
  ) {
    const [response] = await Promise.all([
      this.page.waitForResponse((response) => response.url().includes(url)),
      triggerAction(...args),
    ]);
    return {
      status: response.status(),
      headers: response.headers(),
      body: (await response.json()) as U,
    };
  }

  async swipeElement(locator: Locator, direction: "left" | "right") {
    test.step(`Swipe element horizontally to ${direction}`, async () => {
      await locator.waitFor({ state: "visible" });
      const box = await locator.boundingBox();
      if (!box) throw new Error("Cannot swipe: locator not visible");

      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      const offset = box.width * 0.9;
      const endX = direction === "left" ? startX - offset : startX + offset;

      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();
      await this.page.mouse.move(endX, startY, { steps: 10 });
      await this.page.mouse.up();
    });
  }
}
