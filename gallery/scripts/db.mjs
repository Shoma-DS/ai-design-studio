import { execFileSync } from "node:child_process";
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
  throw new Error("DATABASE_URL が設定されていません。gallery/.env を確認してください。");
}

export const sql = neon(process.env.DATABASE_URL);

// 作品の制作者名。指定が無ければ git の user.name（コミット時の名前）を使う。
export function gitAuthorName() {
  try {
    return execFileSync("git", ["config", "user.name"], {
      cwd: __dirname,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim() || null;
  } catch {
    return null;
  }
}

export async function upsertLandingPage(entry) {
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
    insert into landing_pages (slug, title, heading, category, mood_tags, product_tags, feature_tags, url, thumbnail, updated_at)
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

export async function upsertPortfolioItem(entry) {
  const {
    slug,
    type,
    title,
    heading = null,
    category,
    moodTags = [],
    productTags = [],
    featureTags = [],
    linkType = "external",
    url,
    thumbnail,
    author
  } = entry;

  // author を明示した場合だけ上書きし、未指定の更新では最初の制作者を残す。
  const authorGiven = typeof author === "string" && author.trim() !== "";
  const authorValue = authorGiven ? author.trim() : gitAuthorName();

  const rows = await sql`
    insert into portfolio_items (slug, type, title, heading, category, mood_tags, product_tags, feature_tags, link_type, url, thumbnail, author, updated_at)
    values (${slug}, ${type}, ${title}, ${heading}, ${category}, ${moodTags}, ${productTags}, ${featureTags}, ${linkType}, ${url}, ${thumbnail}, ${authorValue}, now())
    on conflict (slug) do update set
      type = excluded.type,
      title = excluded.title,
      heading = excluded.heading,
      category = excluded.category,
      mood_tags = excluded.mood_tags,
      product_tags = excluded.product_tags,
      feature_tags = excluded.feature_tags,
      link_type = excluded.link_type,
      url = excluded.url,
      thumbnail = excluded.thumbnail,
      author = case when ${authorGiven} then excluded.author else coalesce(portfolio_items.author, excluded.author) end,
      updated_at = now()
    returning author
  `;

  return rows[0]?.author ?? null;
}

export async function upsertAnimation(entry) {
  const {
    slug,
    name,
    category,
    description,
    cssCode,
    htmlSnippet = null,
    jsCode = null,
    tags = [],
    useCase = null,
    moodTags = []
  } = entry;

  await sql`
    insert into animations (slug, name, category, description, css_code, html_snippet, js_code, tags, use_case, mood_tags, updated_at)
    values (${slug}, ${name}, ${category}, ${description}, ${cssCode}, ${htmlSnippet}, ${jsCode}, ${tags}, ${useCase}, ${moodTags}, now())
    on conflict (slug) do update set
      name = excluded.name,
      category = excluded.category,
      description = excluded.description,
      css_code = excluded.css_code,
      html_snippet = excluded.html_snippet,
      js_code = excluded.js_code,
      tags = excluded.tags,
      use_case = excluded.use_case,
      mood_tags = excluded.mood_tags,
      updated_at = now()
  `;
}
