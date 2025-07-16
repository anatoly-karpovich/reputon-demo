import path from "path";
import fs from "fs-extra";

export default function globalSetup() {
  if (process.env.CI) return;

  const rootDir = path.resolve(__dirname, "../../");
  const allureResultsPath = path.resolve(rootDir, "allure-results");
  const playwrightReportPath = path.resolve(rootDir, "playwright-report");

  fs.emptyDir(playwrightReportPath);
  fs.emptyDir(allureResultsPath);

  console.log("🧹 Cleared report folders:", playwrightReportPath, allureResultsPath);
}
