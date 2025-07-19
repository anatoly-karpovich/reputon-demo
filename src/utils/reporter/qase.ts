import path from "path";
import fs from "fs";

export function setUpQase() {
  if (!process.env.CI) {
    process.env.QASE_MODE = "testops";
    const tmpPath = path.resolve(process.cwd(), ".tmp/qase-run.json");
    if (!fs.existsSync(tmpPath)) {
      const argv = process.argv.join(" ");
      const match = argv.match(/--project=(\S+)/);
      const projectName = match?.[1] || "Untitled Project";

      const runName = `${projectName} — Playwright Test Run ${new Date().toISOString()}`;
      const filepath = path.resolve(process.cwd(), ".tmp/qase-run.json");
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, JSON.stringify({ runName }, null, 2));
      process.env.QASE_RUN_NAME = runName;
    } else {
      const { runName } = JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
      process.env.QASE_RUN_NAME = runName;
    }
  }
}
