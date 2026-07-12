import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, "..", ".env");

function loadEnv() {
  if (process.env.DATABASE_URL) return;
  if (!fs.existsSync(ENV_PATH)) return;
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2];
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL が設定されていません。gallery-hp/.env を確認してください。");
}

export const sql = neon(process.env.DATABASE_URL);

export async function upsertWebsite(entry) {
  const {
    slug,
    title,
    heading,
    category,
    moodTags = [],
    productTags = [],
    featureTags = [],
    url,
    thumbnail
  } = entry;

  await sql`
    insert into websites (slug, title, heading, category, mood_tags, product_tags, feature_tags, url, thumbnail, updated_at)
    values (${slug}, ${title}, ${heading}, ${category}, ${moodTags}, ${productTags}, ${featureTags}, ${url}, ${thumbnail}, now())
    on conflict (slug) do update set
      title = excluded.title,
      heading = excluded.heading,
      category = excluded.category,
      mood_tags = excluded.mood_tags,
      product_tags = excluded.product_tags,
      feature_tags = excluded.feature_tags,
      url = excluded.url,
      thumbnail = excluded.thumbnail,
      updated_at = now()
  `;
}
