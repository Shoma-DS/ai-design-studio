import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      select slug, title, heading, category, mood_tags, product_tags, feature_tags, url, thumbnail
      from landing_pages
      order by created_at asc
    `;
    const data = rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      heading: row.heading,
      category: row.category,
      moodTags: row.mood_tags ?? [],
      productTags: row.product_tags ?? [],
      featureTags: row.feature_tags ?? [],
      url: row.url,
      thumbnail: row.thumbnail
    }));
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "landing_pages の取得に失敗しました。" });
  }
}
