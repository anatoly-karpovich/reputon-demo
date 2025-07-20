import fs from "fs/promises";
import path from "path";
import { TelegramNotification } from "../utils/notifications/telegram";
import dotenv from "dotenv";
import { TestMeta } from "../utils/reporter/reputon.reporter";

dotenv.config();

const summaryPath = path.resolve("playwright-report/final-summary.json");

async function main() {
  console.log("📦 Preparing report for Telegram...");
  try {
    const raw = await fs.readFile(summaryPath, "utf-8");
    const results: TestMeta[] = JSON.parse(raw);

    const stats = results.reduce(
      (acc, result) => {
        acc.total += 1;
        if (result.status === "passed") acc.passed += 1;
        else if (result.status === "failed") acc.failed += 1;
        else if (result.status === "skipped") acc.skipped += 1;
        else if (result.status === "timedOut") acc.timedOut += 1;
        else if (result.status === "interrupted") acc.interrupted += 1;
        return acc;
      },
      {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        timedOut: 0,
        interrupted: 0,
      },
    );

    const applications = [
      ...results.reduce((acc, result) => {
        result.application && acc.add(result.application.replace("@", "").toUpperCase());
        return acc;
      }, new Set<string>()),
    ];
    const projectName = results.at(-1)!.projectName;

    const telegram = new TelegramNotification();
    const message = await telegram.generateStatisticsMessage({ applications, projectName }, stats);
    await telegram.sendMessage(message);
    console.log("✅ Report successfully sent to Telegram 🎉");
  } catch (err: any) {
    console.error("❌ Failed to send test notification:", err.message);
    process.exit(1);
  }
}

main();
