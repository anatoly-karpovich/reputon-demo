import { mergeTests, expect } from "@playwright/test";
import { test as googlePages } from "fixtures/pages.fixture";
import { test as googleMock } from "fixtures/mock.fixture";
import { test as uiServices } from "fixtures/ui-services.fixture";

const test = mergeTests(googlePages, googleMock, uiServices);

export { test, expect };
