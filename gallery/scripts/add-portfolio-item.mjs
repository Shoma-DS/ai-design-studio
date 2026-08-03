import fs from "node:fs";
import { gitAuthorName, upsertPortfolioItem } from "./db.mjs";

const args = process.argv.slice(2);
let jsonPath = null;
let authorOverride = null;

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--author") {
    authorOverride = args[i + 1] ?? null;
    i += 1;
  } else if (args[i].startsWith("--author=")) {
    authorOverride = args[i].slice("--author=".length);
  } else if (!jsonPath) {
    jsonPath = args[i];
  }
}

if (!jsonPath) {
  console.error('使い方: node scripts/add-portfolio-item.mjs <entry.json> [--author "制作者名"]');
  console.error(
    '例: {"slug":"...", "type":"lp|hp|moving-lp|swipe-lp|banner|thumbnail|sns-post|flyer", "title":"...", "heading":"...", "category":"...", "moodTags":[], "productTags":[], "featureTags":[], "linkType":"external|image", "url":"...", "thumbnail":"assets/thumbnails/....jpg", "author":"制作者名（省略可）"}'
  );
  console.error(`author を省略すると git config user.name（現在: ${gitAuthorName() ?? "未設定"}）が入る。`);
  process.exit(1);
}

const entry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
if (authorOverride) entry.author = authorOverride;

// 新規登録は制作者名を必ず残す。git user.name も未設定なら登録せず止める。
const resolvedAuthor = (entry.author ?? "").trim() || gitAuthorName();
if (!resolvedAuthor) {
  console.error("制作者名が決まらないため登録を中止しました。");
  console.error('対処: git config user.name を設定するか、--author "制作者名" を付けて実行してください。');
  process.exit(1);
}

const author = await upsertPortfolioItem(entry);
console.log(`登録/更新しました: ${entry.slug} (${entry.type}) / 制作者: ${author ?? "未記入"}`);
