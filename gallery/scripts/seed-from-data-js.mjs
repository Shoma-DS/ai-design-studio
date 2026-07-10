import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { upsertLandingPage } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataJsPath = path.join(__dirname, "..", "data.js");
const raw = fs.readFileSync(dataJsPath, "utf8");
const arrayLiteral = raw
  .replace(/^[\s\S]*?window\.LP_GALLERY_DATA\s*=\s*/, "")
  .replace(/;\s*$/, "");

const entries = new Function(`return (${arrayLiteral});`)();

for (const entry of entries) {
  await upsertLandingPage(entry);
  console.log(`登録: ${entry.slug}`);
}

console.log(`完了: ${entries.length}件を landing_pages に登録しました。`);
