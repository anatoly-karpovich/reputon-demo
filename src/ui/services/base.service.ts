import { Page } from "@playwright/test";

export abstract class BaseUIService {
  constructor(protected page: Page) {}
}
