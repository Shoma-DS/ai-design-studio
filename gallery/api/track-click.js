import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const pageSlug = String(body.pageSlug || "").slice(0, 255);
    const buttonLabel = String(body.buttonLabel || "").slice(0, 255);
    const targetUrl = body.targetUrl ? String(body.targetUrl).slice(0, 2000) : null;

    if (!pageSlug || !buttonLabel) {
      res.status(400).json({ error: "pageSlug と buttonLabel は必須です。" });
      return;
    }

    const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);

    const sql = neon(process.env.DATABASE_URL);
    await sql`
      insert into button_clicks (page_slug, button_label, target_url, user_agent)
      values (${pageSlug}, ${buttonLabel}, ${targetUrl}, ${userAgent})
    `;

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "記録に失敗しました。" });
  }
}
