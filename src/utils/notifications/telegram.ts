import TelegramBot from "node-telegram-bot-api";
import { QaseApi } from "qaseio";
import fs from "fs";
import path from "path";

export class TelegramNotification {
  botToken: string;
  chatId: string;
  bot: TelegramBot;
  constructor() {
    this.botToken = `${process.env.TELEGRAM_BOT_TOKEN}`;
    this.chatId = `${process.env.TELEGRAM_CHAT_ID}`;
    this.bot = new TelegramBot(this.botToken, { polling: false });
  }

  async sendMessage(message: string) {
    try {
      await this.bot.sendMessage(this.chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    } catch (error: any) {
      console.error("Failed to send notification", error.message);
    }
  }

  async generateStatisticsMessage(
    meta: {
      applications: string[];
      projectName: string;
    },
    stats: {
      passed: number;
      failed: number;
      skipped: number;
      timedOut: number;
      interrupted: number;
      total: number;
    },
  ) {
    const messageParts = [
      `🏁 <b>Playwright Test Run Summary</b>\n`,
      `📂 <b>Project:</b> <i><u>${meta.projectName}</u></i>`,
      `⚙️ <b>Applications:</b> <i><u>${meta.applications.join(", ")}</u></i>\n`,
      `📊 <b>Total:</b> ${stats.total}`,
      `✅ <b>Passed:</b> ${stats.passed}`,
      `❌ <b>Failed:</b> ${stats.failed}`,
      `⚠️ <b>Skipped:</b> ${stats.skipped}`,
      `🕒 <b>Timed out:</b> ${stats.timedOut}`,
      `💥 <b>Interrupted:</b> ${stats.interrupted}`,
    ];

    let qaseRunId: number | undefined;
    try {
      const qase = new QaseApi({ token: `${process.env.QASE_API_TOKEN}` });
      const filepath = path.resolve(process.cwd(), ".tmp/qase-run.json");
      const { runName } = JSON.parse(fs.readFileSync(filepath, "utf-8"));
      const run = await qase.runs.getRuns(`${process.env.QASE_PROJECT_ID}`, runName);
      const id = run.data.result?.entities!.map((e) => e.id)![0];
      qaseRunId = id;
    } catch (error) {
      console.error(error);
    }

    messageParts.push(
      `\n🔗 <b>Allure Report:</b> <a href="https://anatoly-karpovich.github.io/reputon-demo/allure-report/#">Open Allure Report</a>`,
    );
    if (qaseRunId) {
      messageParts.push(`\n📝 <b>Qase Run:</b> <a href="https://qase.io/run/${qaseRunId}">Open Qase Run</a>`);
    }

    const finalMessage = messageParts.join("\n");

    return finalMessage;
  }
}
