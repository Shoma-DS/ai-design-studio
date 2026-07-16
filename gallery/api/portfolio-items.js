import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      select slug, type, title, heading, category, mood_tags, product_tags, feature_tags, link_type, url, thumbnail
      from portfolio_items
      order by created_at asc
    `;
    const data = rows.map((row) => ({
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
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "portfolio_items の取得に失敗しました。" });
  }
}
