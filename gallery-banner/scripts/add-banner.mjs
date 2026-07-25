import fs from "node:fs";
import { upsertBanner } from "./db.mjs";

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error("使い方: node scripts/add-banner.mjs <entry.json>");
  process.exit(1);
}

const entry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
await upsertBanner(entry);
console.log(`登録/更新しました: ${entry.slug}`);
