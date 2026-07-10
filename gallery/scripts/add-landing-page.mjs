import fs from "node:fs";
import { upsertLandingPage } from "./db.mjs";

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("使い方: node scripts/add-landing-page.mjs <entry.json>");
  console.error(
    '例: {"slug":"...", "title":"...", "heading":"...", "category":"...", "moodTags":[], "productTags":[], "featureTags":[], "url":"...", "thumbnail":"assets/thumbnails/....jpg"}'
  );
  process.exit(1);
}

const entry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
await upsertLandingPage(entry);
console.log(`登録/更新しました: ${entry.slug}`);
