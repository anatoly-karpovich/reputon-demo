import path from "path";
import fs from "fs-extra";

export default function globalSetup() {
  if (process.env.CI) return;

  const argv = process.argv.join(" ");
  const match = argv.match(/--project=(\S+)/);
  const projectName = match?.[1] || "Untitled Project";

  process.env.QASE_RUN_NAME = `${projectName} — Playwright Test Run ${new Date().toISOString()}`;

  const rootDir = path.resolve(__dirname, "../../");
  const allureResultsPath = path.resolve(rootDir, "allure-results");
  const playwrightReportPath = path.resolve(rootDir, "playwright-report");

  fs.emptyDir(playwrightReportPath);
  fs.emptyDir(allureResultsPath);

  console.log("🧹 Cleared report folders:", playwrightReportPath, allureResultsPath);
}
