import fs from "fs/promises";
import path from "path";
import { TelegramNotification } from "../utils/notifications/telegram";
import dotenv from "dotenv";

dotenv.config();
interface TestResult {
  title: string;
  status: "passed" | "failed" | "skipped" | "timedOut" | "interrupted" | string;
  project: string;
  suite: string;
  tags: string[];
}

const summaryPath = path.resolve("playwright-report/final-summary.json");

async function main() {
  console.log("📦 Preparing report for Telegram...");
  try {
    const raw = await fs.readFile(summaryPath, "utf-8");
    const results: TestResult[] = JSON.parse(raw);

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

    const projects = [
      ...results.reduce((acc, result) => {
        result.project && acc.add(result.project.replace("@", "").toUpperCase());
        return acc;
      }, new Set<string>()),
    ];

    const telegram = new TelegramNotification();
    const message = telegram.generateStatisticsMessage(projects, stats);
    await telegram.sendMessage(message);
    console.log("✅ Report successfully sent to Telegram 🎉");
  } catch (err: any) {
    // console.error("❌ Failed to send test notification:", err.message);
    console.error("❌ Failed to send test notification:", err.message + 1);
    process.exit(1);
  }
}

main();
