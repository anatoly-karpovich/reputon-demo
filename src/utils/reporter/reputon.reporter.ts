import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { APPLICATIONS, TEST_LEVELS, TEST_TYPES } from "data/tags";
import * as fs from "fs/promises";
import * as path from "path";

export interface TestMeta {
  suiteTitle: string;
  testTitle: string;
  projectName: string;
  status: TestResult["status"];
  duration: number;
  tags: string[];
  application: string;
  testType: string;
  testLevel: string;
  retry: number;
}

class ReputonReporter implements Reporter {
  private finalResults = new Map<string, TestMeta>();

  private getFullTestId(suiteTitle: string, testTitle: string): string {
    return `${suiteTitle} > ${testTitle}`;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const suiteTitle = test.parent?.title || "Untitled Suite";
    const testTitle = test.title;
    const testId = this.getFullTestId(suiteTitle, testTitle);
    const projectName = test.parent.project()!.name ?? "Custom";
    const tags = test.tags;
    const application = tags.find((tag) => Object.values(APPLICATIONS).includes(tag as APPLICATIONS)) || "";
    const testType = tags.find((tag) => Object.values(TEST_TYPES).includes(tag as TEST_TYPES)) || "";
    const testLevel = tags.find((tag) => Object.values(TEST_LEVELS).includes(tag as TEST_LEVELS)) || "";

    this.finalResults.set(testId, {
      suiteTitle,
      testTitle,
      status: result.status,
      duration: result.duration,
      tags,
      projectName,
      application,
      testType,
      testLevel,
      retry: result.retry,
    });
  }

  async onEnd() {
    const reportPath = path.resolve(__dirname, "../../../playwright-report/final-summary.json");
    await fs.mkdir(path.dirname(reportPath), { recursive: true });

    const output = Array.from(this.finalResults.values());

    await fs.writeFile(reportPath, JSON.stringify(output, null, 2), "utf-8");
  }
}

export default ReputonReporter;
