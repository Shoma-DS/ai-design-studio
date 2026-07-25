import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2];
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL が設定されていません。");
}

export const sql = neon(process.env.DATABASE_URL);

export async function upsertBanner(entry) {
  const {
    slug, title, heading, category,
    moodTags = [], productTags = [], featureTags = [],
    url, thumbnail, width, height, format = "png"
  } = entry;

  await sql`
    insert into banners (
      slug, title, heading, category, mood_tags, product_tags, feature_tags,
      url, thumbnail, width, height, format, updated_at
    )
    values (
      ${slug}, ${title}, ${heading}, ${category}, ${moodTags}, ${productTags}, ${featureTags},
      ${url}, ${thumbnail}, ${width}, ${height}, ${format}, now()
    )
    on conflict (slug) do update set
      title = excluded.title,
      heading = excluded.heading,
      category = excluded.category,
      mood_tags = excluded.mood_tags,
      product_tags = excluded.product_tags,
      feature_tags = excluded.feature_tags,
      url = excluded.url,
      thumbnail = excluded.thumbnail,
      width = excluded.width,
      height = excluded.height,
      format = excluded.format,
      updated_at = now()
  `;
}
