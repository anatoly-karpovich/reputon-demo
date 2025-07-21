import path from "path";
import fs from "fs-extra";

export default function globalSetup() {
  if (process.env.CI) return;

  const allureResultsPath = path.resolve(process.cwd(), "allure-results");
  const playwrightReportPath = path.resolve(process.cwd(), "playwright-report");

  fs.emptyDir(playwrightReportPath);
  fs.emptyDir(allureResultsPath);

  console.log("🧹 Cleared report folders:", playwrightReportPath, allureResultsPath);
}
