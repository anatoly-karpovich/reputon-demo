import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { PROJECTS, TEST_LEVELS, TEST_TYPES } from "data/tags";
import * as fs from "fs/promises";
import * as path from "path";

type TestMeta = {
  suiteTitle: string;
  testTitle: string;
  status: TestResult["status"];
  duration: number;
  tags: string[];
  project: string;
  testType: string;
  testLevel: string;
  retry: number;
};

class ReputonReporter implements Reporter {
  private finalResults = new Map<string, TestMeta>();

  private getFullTestId(suiteTitle: string, testTitle: string): string {
    return `${suiteTitle} > ${testTitle}`;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const suiteTitle = test.parent?.title || "Global";
    const testTitle = test.title;
    const testId = this.getFullTestId(suiteTitle, testTitle);

    const tags = test.tags;
    const project = tags.find((tag) => Object.values(PROJECTS).includes(tag as PROJECTS)) || "";
    const testType = tags.find((tag) => Object.values(TEST_TYPES).includes(tag as TEST_TYPES)) || "";
    const testLevel = tags.find((tag) => Object.values(TEST_LEVELS).includes(tag as TEST_LEVELS)) || "";

    this.finalResults.set(testId, {
      suiteTitle,
      testTitle,
      status: result.status,
      duration: result.duration,
      tags,
      project,
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
