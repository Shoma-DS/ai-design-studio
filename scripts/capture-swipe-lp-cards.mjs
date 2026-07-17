import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const OUT_DIR = path.join(REPO_ROOT, "projects/coconala-swipe-lp-thumbnail/output/crops");
const WAIT_MS = 700;

async function shoot(page, filename) {
  await page.waitForTimeout(WAIT_MS);
  await page.screenshot({ path: path.join(OUT_DIR, filename), type: "png" });
  console.log(`  saved ${filename}`);
}

async function clickNext(page) {
  await page.click("#nextBtn");
}

async function clickHNext(page) {
  await page.click(".card.is-active .h-nav--next");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

  // --- Lumière Nail Atelier ---
  console.log("Lumière Nail Atelier");
  const lumierePath = path.join(REPO_ROOT, "portfolio/lumiere-nail-atelier-swipe-lp/lp/index.html");
  await page.goto(`file://${lumierePath}`);
  await page.waitForTimeout(WAIT_MS);
  await shoot(page, "lumiere-01-hook.png"); // card 1

  await clickNext(page); // card 2 ABOUT US
  await shoot(page, "lumiere-02-about.png");

  await clickNext(page); // card 3 group: DESIGN divider (child 0)
  await shoot(page, "lumiere-03-design-divider.png");
  await clickHNext(page); // child 1: Rose Quartz
  await shoot(page, "lumiere-04-design-rosequartz.png");
  await clickHNext(page); // child 2: Sheer Beige
  await shoot(page, "lumiere-05-design-sheerbeige.png");
  await clickHNext(page); // child 3: Marble Gold
  await shoot(page, "lumiere-06-design-marblegold.png");

  await clickNext(page); // card 4 group: MENU divider (child 0)
  await shoot(page, "lumiere-07-menu-divider.png");
  await clickHNext(page); // child 1: price list
  await shoot(page, "lumiere-08-menu-price.png");

  await clickNext(page); // card 5 salon interior
  await shoot(page, "lumiere-09-salon.png");

  await clickNext(page); // card 6 group: REVIEWS (child 0)
  await shoot(page, "lumiere-10-review1.png");
  await clickHNext(page);
  await shoot(page, "lumiere-11-review2.png");
  await clickHNext(page);
  await shoot(page, "lumiere-12-review3.png");

  await clickNext(page); // card 7 group: ACCESS divider (child 0)
  await shoot(page, "lumiere-13-access-divider.png");
  await clickHNext(page);
  await shoot(page, "lumiere-14-access-detail.png");

  await clickNext(page); // card 8 final CTA
  await shoot(page, "lumiere-15-final-cta.png");

  // --- NOBIRU CONSULTING ---
  console.log("NOBIRU CONSULTING");
  const nobiruPath = path.join(REPO_ROOT, "portfolio/nobiru-consulting-swipe-lp/lp/index.html");
  await page.goto(`file://${nobiruPath}`);
  await page.waitForTimeout(WAIT_MS);
  await shoot(page, "nobiru-01-hook.png");

  await clickNext(page);
  await shoot(page, "nobiru-02-achievement.png");

  await clickNext(page);
  await shoot(page, "nobiru-03-concern.png");

  await clickNext(page);
  await shoot(page, "nobiru-04-solution.png");

  await clickNext(page);
  await shoot(page, "nobiru-05-testimonial1.png");

  await clickNext(page);
  await shoot(page, "nobiru-06-testimonial2.png");

  await clickNext(page);
  await shoot(page, "nobiru-07-representative.png");

  await clickNext(page);
  await shoot(page, "nobiru-08-final-cta.png");

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
