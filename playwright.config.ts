import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { setUpQase } from "utils/reporter/qase";

dotenv.config();
setUpQase();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src/",
  globalSetup: require.resolve("./src/config/global.setup"),
  globalTeardown: require.resolve("./src/config/global.teardown"),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["allure-playwright"],
    ["./src/utils/reporter/reputon.reporter.ts"],
    [
      "playwright-qase-reporter",
      {
        testops: {
          api: {
            token: process.env.QASE_API_TOKEN,
          },
          project: process.env.QASE_PROJECT_ID,
          uploadAttachments: true,
          run: {
            complete: true,
            title: process.env.QASE_RUN_NAME ?? `Playwright Test Run ${new Date().toISOString()}`,
          },
        },
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "google-setup", testMatch: /.*\.google-setup\.ts/ },
    {
      name: "google-reviews",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        viewport: { width: 1920, height: 1080 },
        storageState: "src/.auth/google-login.json",
      },
      dependencies: ["google-setup"],
      testMatch: /.*\.spec\.ts/,
      testDir: "src/ui/tests/Google",
    },
    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"] },
    // },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
