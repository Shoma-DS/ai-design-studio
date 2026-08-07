import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const PROJECT_DIR = "/Users/yamamotorina/Documents/ai-design-studio/projects/hair-salon-menu-instagram";
const OUT_DIR = path.join(PROJECT_DIR, "output");

const targets = [
  { html: "pattern-a-all.html", out: "menu-a-all.png" },
  { html: "pattern-b-signature.html", out: "menu-b-signature.png" },
  { html: "pattern-c-all-menu.html", out: "menu-c-all-menu.png" },
  { html: "yurau-01-signature.html", out: "yurau-01-signature.png" },
  { html: "yurau-02-all-menu.html", out: "yurau-02-all-menu.png" },
  { html: "yurau-all-19.html", out: "yurau-all-19.png" },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

for (const t of targets) {
  const file = path.join(PROJECT_DIR, t.html);
  if (!fs.existsSync(file)) {
    console.log(`skip (not found): ${t.html}`);
    continue;
  }
  await page.goto(`file://${file}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const sheet = await page.$(".sheet");
  await sheet.screenshot({ path: path.join(OUT_DIR, t.out), type: "png" });
  console.log(`saved: output/${t.out}`);
}

await browser.close();
