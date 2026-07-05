// LPのファーストビューをサムネイル画像として撮影する。
// Usage: node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> <出力先jpgパス>
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> <出力先jpgパス>");
  process.exit(1);
}

const absoluteInput = path.resolve(inputPath);
if (!fs.existsSync(absoluteInput)) {
  console.error(`Not found: ${absoluteInput}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(`file://${absoluteInput}`, { waitUntil: "networkidle" });
await page.screenshot({ path: path.resolve(outputPath), type: "jpeg", quality: 85 });
await browser.close();

console.log(`saved: ${outputPath}`);
