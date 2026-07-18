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

const media = JSON.parse(await fs.readFile(path.join(projectRoot, "outputs/utage-section-media.json"), "utf8"));
const existingPage = JSON.parse(await fs.readFile(path.join(projectRoot, "outputs/utage-page.json"), "utf8"));

// ローカルのlp/index.html・lp/style.css・lp/script.jsをそのままUTAGEページに埋め込む(実装のズレ防止)
const localHtml = await fs.readFile(path.join(projectRoot, "lp/index.html"), "utf8");
const localCss = await fs.readFile(path.join(projectRoot, "lp/style.css"), "utf8");
const localJs = await fs.readFile(path.join(projectRoot, "lp/script.js"), "utf8");

const mainMatch = localHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
if (!mainMatch) {
  throw new Error("lp/index.html から <main> の中身を抽出できませんでした");
}
let sectionsHtml = mainMatch[1];

// ./images/xxx.png や ./images/mobile/xxx.jpg をUTAGE(S3)のURLへ置換
sectionsHtml = sectionsHtml.replace(
  /\.\/images\/(mobile\/)?([\w-]+)\.(?:png|jpg|jpeg)/g,
  (fullMatch, mobilePrefix, key) => {
    const bucket = mobilePrefix ? media.mobile : media.pc;
    const entry = bucket[key];
    if (!entry) {
      throw new Error(`outputs/utage-section-media.json に ${mobilePrefix || ""}${key} が見つかりません`);
    }
    return entry.url;
  }
);

const htmlSource = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${project.title}</title>
    <style>
${localCss}
    </style>
  </head>
  <body>
    <div class="scroll-progress"></div>
    <main class="lp-shell" aria-label="${project.title}">${sectionsHtml}</main>
    <button type="button" class="back-to-top" aria-label="トップへ戻る">↑</button>
    <script>
${localJs}
    </script>
  </body>
</html>
`;

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

const funnelId = existingPage.funnel.id;
const stepId = existingPage.step.id;
const pageId = existingPage.page.id;

const updated = await api(`/funnels/${funnelId}/steps/${stepId}/pages/${pageId}`, {
  method: "PATCH",
  body: JSON.stringify({
    title: project.title,
    content_type: "raw_html",
    html_source: htmlSource,
    page_title: project.title,
  }),
});
console.log("updated page:", JSON.stringify(updated.data, null, 2).slice(0, 500));

await fs.writeFile(
  path.join(projectRoot, "outputs/utage-page.json"),
  JSON.stringify({ funnel: existingPage.funnel, step: existingPage.step, page: updated.data }, null, 2)
);
console.log("saved outputs/utage-page.json");
