import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      select slug, title, heading, category, mood_tags, product_tags, feature_tags,
             url, thumbnail, width, height, format
      from banners
      order by created_at desc
    `;

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      heading: row.heading,
      category: row.category,
      moodTags: row.mood_tags ?? [],
      productTags: row.product_tags ?? [],
      featureTags: row.feature_tags ?? [],
      url: row.url,
      imageUrl: row.thumbnail,
      width: row.width,
      height: row.height,
      format: row.format
    })));
  } catch {
    res.status(500).json({ error: "banners の取得に失敗しました。" });
  }
}
