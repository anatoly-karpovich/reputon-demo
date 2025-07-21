# Playwright E2E Automation Framework

This repository contains an end-to-end testing framework built with [Playwright](https://playwright.dev/), TypeScript, and integrated with advanced tools like Qase for test management, Allure for reporting, and Telegram for notifications. It is optimized for CI/CD workflows and supports project-specific configuration.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anatoly-karpovich/reputon-demo.git
cd reputon-demo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Create `.env` File

You can copy `.env.dist` and fill in required values:

```bash
cp .env.dist .env
```

Required variables include:

- `QASE_API_TOKEN`
- `QASE_PROJECT_ID`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### 4. Run Tests

```bash
npm run test:ui
```

To run a specific project:

```bash
npx playwright test --project=google-reviews
```

---

## ✅ Qase Integration

Qase test case IDs are linked to tests using:

```ts
import { qase } from "playwright-qase-reporter";

test("should do something"), async ({ page }) => {
  qase.id(123)
  // your test
});
```

A `.tmp/qase-run.json` file is generated to store test run metadata and allow consistent referencing in reports and notifications.

---

## 📦 Reporting

### Allure

After tests, open the Allure report:

```bash
npm run allure-report-open
```

---

### Telegram

After a CI test run, summary statistics and links to Allure & Qase reports are sent to a Telegram chat.

---

## 🤖 CI/CD (GitHub Actions)

There are two workflows:

- `google.yml` — runs E2E tests manually and on schedule
- `build.yml` — checks formatting/linting on PRs to `main`

### Scheduling

You can restrict test runs on specific days or exclude weekend nights by configuring `on.schedule` inside the workflow YAMLs.

---

## 🧠 LLM-Based Test Failure Analysis (Coming Soon)

We are experimenting with:

- Post-run LLM queries per failed test (stack trace, screenshots, code context)
- Aggregated answers saved and optionally published to Qase or attached as zipped logs
- Ability to query locally stored HTML/trace files and receive suggestions

---
