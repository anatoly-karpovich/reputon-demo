import TelegramBot from "node-telegram-bot-api";

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

  generateStatisticsMessage(
    projects: string | string[],
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
      `<b>🏁 Playwright Test Run Summary</b>\n`,
      `<b>⚙️ Projects:</b> ${typeof projects === "string" ? projects : projects.join(", ")}\n`,
      `📊 <b>Total:</b> ${stats.total}`,
      `✅ <b>Passed:</b> ${stats.passed}`,
      `❌ <b>Failed:</b> ${stats.failed}`,
      `⚠️ <b>Skipped:</b> ${stats.skipped}`,
      `🕒 <b>Timed out:</b> ${stats.timedOut}`,
      `💥 <b>Interrupted:</b> ${stats.interrupted}`,
    ];

    messageParts.push(
      `\n🔗 <b>Report:</b> <a href="https://anatoly-karpovich.github.io/reputon-demo/allure-report/#">Open Allure Report</a>`,
    );

    const finalMessage = messageParts.join("\n");

    return finalMessage;
  }
}
