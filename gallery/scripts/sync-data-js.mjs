import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "data.js");

const rows = await sql`
  select slug, type, title, heading, category, mood_tags, product_tags, feature_tags, link_type, url, thumbnail
  from portfolio_items
  order by created_at asc
`;

const items = rows.map((row) => ({
  slug: row.slug,
  type: row.type,
  title: row.title,
  heading: row.heading,
  category: row.category,
  moodTags: row.mood_tags ?? [],
  productTags: row.product_tags ?? [],
  featureTags: row.feature_tags ?? [],
  linkType: row.link_type,
  url: row.url,
  thumbnail: row.thumbnail
}));

const header = `// ポートフォリオギャラリーのデータ（オフラインフォールバック用）。
// 正本はNeon Postgres（portfolio_itemsテーブル）。通常はgallery/scripts/add-portfolio-item.mjsで
// DBに登録し、/api/portfolio-items経由でサイトに反映される。このファイルはDB取得失敗時の
// フォールバックとしてのみ使われる。node scripts/sync-data-js.mjs で再生成できる。
//
// type: 大タブの種類（lp/hp/moving-lp/swipe-lp/banner/thumbnail/sns-post/flyer）
// linkType: "external"=カードクリックで実サイトをiframeプレビュー / "image"=カードクリックで画像を拡大表示
// タグの分類:
// - moodTags: 雰囲気で探す（デザインの印象。カッコイイ/可愛い/上品 など）
// - productTags: 商品で探す（業種・商材のジャンル）
// - featureTags: 機能で探す（実装されている技術的なUI機能。アニメーション/レスポンシブ/カルーセル/
//   アコーディオン/ハンバーガーメニュー/固定ヘッダーなど。ビジネス上の訴求はここに含めない）
window.PORTFOLIO_GALLERY_DATA = `;

const body = JSON.stringify(items, null, 2);
fs.writeFileSync(OUT_PATH, `${header}${body};\n`);
console.log(`data.js を再生成しました（${items.length}件）。`);
