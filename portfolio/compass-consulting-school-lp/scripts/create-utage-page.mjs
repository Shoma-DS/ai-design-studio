import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { project } from "../sections.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "../..");

const envPath = path.join(repoRoot, ".env");
const envText = await fs.readFile(envPath, "utf8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] = process.env[m[1]] || m[2];
}

const API_BASE = process.env.UTAGE_API_BASE_URL;
const API_KEY = process.env.UTAGE_API_KEY;

const media = JSON.parse(await fs.readFile(path.join(projectRoot, "outputs/utage-media.json"), "utf8"));
const pcUrl = media.pc.data.url;
const mobileUrl = media.mobile.data.url;

async function api(pathname, options = {}) {
  const res = await fetch(`${API_BASE}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`${pathname} failed: ${res.status} ${JSON.stringify(json)}`);
  }
  return json;
}

const htmlSource = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${project.title}</title>
    <style>
      html, body { margin: 0; min-height: 100%; background: #eef4fb; font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif; }
      .lp-shell { max-width: 1200px; margin: 0 auto; width: 100%; background: #fff; }
      .lp-full { display: block; width: 100%; max-width: 1200px; height: auto; }
    </style>
  </head>
  <body>
    <main class="lp-shell" aria-label="${project.title}">
      <picture>
        <source media="(max-width: 767px)" srcset="${mobileUrl}">
        <img class="lp-full" src="${pcUrl}" alt="${project.title}">
      </picture>
    </main>
  </body>
</html>
`;

const funnel = await api("/funnels", {
  method: "POST",
  body: JSON.stringify({ name: "COMPASS コンサルタント養成スクール LP" }),
});
console.log("funnel:", JSON.stringify(funnel.data));

const step = await api(`/funnels/${funnel.data.id}/steps`, {
  method: "POST",
  body: JSON.stringify({ name: "LPページ" }),
});
console.log("step:", JSON.stringify(step.data));

const page = await api(`/funnels/${funnel.data.id}/steps/${step.data.id}/pages`, {
  method: "POST",
  body: JSON.stringify({
    title: project.title,
    content_type: "raw_html",
    html_source: htmlSource,
    page_title: project.title,
  }),
});
console.log("page:", JSON.stringify(page.data, null, 2));

await fs.writeFile(
  path.join(projectRoot, "outputs/utage-page.json"),
  JSON.stringify({ funnel: funnel.data, step: step.data, page: page.data }, null, 2)
);
