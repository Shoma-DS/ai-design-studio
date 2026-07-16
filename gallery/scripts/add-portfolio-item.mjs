import fs from "node:fs";
import { upsertPortfolioItem } from "./db.mjs";

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("使い方: node scripts/add-portfolio-item.mjs <entry.json>");
  console.error(
    '例: {"slug":"...", "type":"lp|hp|moving-lp|swipe-lp|banner|thumbnail|sns-post|flyer", "title":"...", "heading":"...", "category":"...", "moodTags":[], "productTags":[], "featureTags":[], "linkType":"external|image", "url":"...", "thumbnail":"assets/thumbnails/....jpg"}'
  );
  process.exit(1);
}

const entry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
await upsertPortfolioItem(entry);
console.log(`登録/更新しました: ${entry.slug} (${entry.type})`);
