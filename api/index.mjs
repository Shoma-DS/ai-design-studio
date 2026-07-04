import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = process.cwd();
const PROJECT_ROOT = path.join(REPO_ROOT, "projects", "ai-income-course");
const LP_VERSION_ROOT = path.join(PROJECT_ROOT, "ver01-fresh-green");
const LP_DIR = path.join(LP_VERSION_ROOT, "lp");
const COPY_PATH = path.join(LP_DIR, "copy", "lp-copy-v3.md");
const FALLBACK_COPY_PATH = path.join(PROJECT_ROOT, "LP原稿.md");
const PROMPT_PATH = path.join(LP_VERSION_ROOT, "section-image-prompts.md");
const LP_HTML_PATH = path.join(LP_DIR, "index.html");

const SECTION_IMAGE_FALLBACKS = [
  ["SEC-01", "IMG_hero_bg"],
  ["SEC-02", "IMG_bridge"],
  ["SEC-03", "IMG_pain"],
  ["SEC-04", "IMG_what_is_ai"],
  ["SEC-05", "IMG_why_now"],
  ["SEC-06", "IMG_wall"],
  ["SEC-07a", "IMG_cases_01"],
  ["SEC-07b", "IMG_cases_02"],
  ["SEC-08", "IMG_curriculum"],
  ["SEC-09", "IMG_benefits"],
  ["SEC-10", "IMG_campaign"],
  ["SEC-11", "IMG_difference"],
  ["SEC-12", "IMG_comparison"],
  ["SEC-13a", "IMG_faq_01"],
  ["SEC-13b", "IMG_faq_02"],
  ["SEC-14", "IMG_final_cta"]
];

const COPY_ID_OVERRIDES = new Map([
  ["SEC-13a", "SEC-13"],
  ["SEC-13b", "SEC-14"],
  ["SEC-14", "SEC-15"]
]);

const LOOP_DEFS = [
  ["showcase-intro", "制作物を大公開", "showcase-intro-loop-section"],
  ["web", "Webデザイナー", "ai-loop-section--web-designer"],
  ["sns", "SNS運用代行", "ai-loop-section--sns-marketer"],
  ["consultant-explain", "AIコンサルタントとは", "showcase-final/bg/consultant-explain.webp"],
  ["consultant-template", "AIコンサル資料モック", "consultant-template-section"],
  ["video-mockup", "動画モックアップ", "ai-video-section"],
  ["worker-income", "AI作業代行の収入化", "showcase-final/bg/worker-income.webp"],
  ["assistant-explain", "次世代オンライン秘書", "showcase-final/bg/assistant-explain.webp"],
  ["route-choice-cta", "ルート選択CTA", "showcase-final/bg/route-choice-cta.webp"]
];

const safeText = (value) => typeof value === "string" ? value : "";

function sendJson(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function readText(target) {
  return fs.readFile(target, "utf8");
}

async function getFileMtime(target) {
  try {
    return (await fs.stat(target)).mtimeMs;
  } catch {
    return Date.now();
  }
}

function normalizeId(value) {
  const raw = safeText(value).trim();
  const sec = raw.match(/SEC[-\s]?(\d{1,2})([a-z])?/i);
  if (sec) return `SEC-${sec[1].padStart(2, "0")}${sec[2] ?? ""}`;
  const copy = raw.match(/^(\d{1,2})\b/);
  if (copy) return `SEC-${copy[1].padStart(2, "0")}`;
  return raw;
}

function parseMarkdownSections(raw, normalizer = normalizeId) {
  const sections = new Map();
  const order = [];
  const matches = [...safeText(raw).matchAll(/^##\s+(.+)$/gm)];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const header = match[1].trim();
    const id = normalizer(header);
    if (!/^SEC-\d{2}/.test(id)) continue;
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : raw.length;
    if (!sections.has(id)) order.push(id);
    sections.set(id, {
      id,
      header,
      body: raw.slice(start, end).trim()
    });
  }
  return { sections, order };
}

function imageNameFromLayer(layerName) {
  const base = safeText(layerName).replace(/`/g, "").replace(/^\s*images\//, "").trim();
  if (!base) return "";
  if (base.includes("*")) return "";
  if (/\.(png|jpe?g|webp)$/i.test(base)) return base;
  return `${base}.webp`;
}

function parseImageTable(promptRaw) {
  const rows = new Map();
  for (const line of safeText(promptRaw).split(/\r?\n/)) {
    if (!line.includes("| SEC-")) continue;
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (cells.length < 4) continue;
    const id = normalizeId(cells[0]);
    const title = cells[1] || id;
    const layer = cells[3]?.replace(/`/g, "") ?? "";
    rows.set(id, { title, imageName: imageNameFromLayer(layer) });
  }
  return rows;
}

async function readHtmlImageOrder() {
  let html = "";
  try {
    html = await readText(LP_HTML_PATH);
  } catch {
    return new Map();
  }
  const order = new Map();
  for (const match of html.matchAll(/(?:src|data-src)=["']images\/([^"']+)["']/gi)) {
    const key = path.basename(match[1]).replace(/\.[^.]+$/, "").toLowerCase();
    if (key && !order.has(key)) order.set(key, match.index);
  }
  return order;
}

function copyIdForSection(id) {
  return COPY_ID_OVERRIDES.get(id) ?? id.replace(/[a-z]$/, "");
}

async function buildState() {
  const copyPath = await pathExists(COPY_PATH) ? COPY_PATH : FALLBACK_COPY_PATH;
  const [copyRaw, promptRaw, htmlImageOrder, htmlMtime] = await Promise.all([
    readText(copyPath),
    readText(PROMPT_PATH),
    readHtmlImageOrder(),
    getFileMtime(LP_HTML_PATH)
  ]);
  const copyParsed = parseMarkdownSections(copyRaw);
  const promptParsed = parseMarkdownSections(promptRaw);
  const imageTable = parseImageTable(promptRaw);
  const fallbackImages = new Map(SECTION_IMAGE_FALLBACKS.map(([id, layer]) => [id, imageNameFromLayer(layer)]));
  const ids = promptParsed.order.length ? promptParsed.order : SECTION_IMAGE_FALLBACKS.map(([id]) => id);
  const sections = ids.map((id) => {
    const promptSection = promptParsed.sections.get(id);
    const copySection = copyParsed.sections.get(copyIdForSection(id));
    const table = imageTable.get(id);
    const imageName = table?.imageName || fallbackImages.get(id) || "";
    const htmlKey = path.basename(imageName).replace(/\.[^.]+$/, "").toLowerCase();
    return {
      id,
      title: table?.title || promptSection?.header || copySection?.header || id,
      copyHeader: copySection?.header || "",
      promptHeader: promptSection?.header || "",
      copy: copySection?.body || "",
      prompt: promptSection?.body || "",
      imageName,
      imagePath: imageName ? `projects/ai-income-course/ver01-fresh-green/lp/images/${imageName}` : "",
      imageUrl: imageName ? `/lp-assets/images/${imageName}?v=${htmlMtime}` : "",
      publicImageUrl: "",
      htmlOrder: htmlImageOrder.get(htmlKey) ?? null,
      imageMeta: null
    };
  });
  return {
    project: {
      name: "最新AI活用 完全マスター講座",
      copyPath: "projects/ai-income-course/ver01-fresh-green/lp/copy/lp-copy-v3.md",
      promptPath: "projects/ai-income-course/ver01-fresh-green/section-image-prompts.md",
      imageDir: "projects/ai-income-course/ver01-fresh-green/lp/images",
      lpDir: "projects/ai-income-course/ver01-fresh-green/lp",
      lpHtmlPath: "projects/ai-income-course/ver01-fresh-green/lp/index.html",
      lpHtmlUrl: `/lp-assets/index.html?v=${htmlMtime}`,
      fullImagePath: "projects/ai-income-course/ver01-fresh-green/lp/images/lp-full.png",
      fullImageUrl: "",
      publicUrl: process.env.LP_PUBLIC_URL || "",
      fullPublicImageUrl: "",
      readOnly: true,
      readOnlyReason: "Vercel上のGUIは表示確認用です。保存・画像生成・公開操作はローカルGUIで実行してください。"
    },
    sections,
    operationHistory: { canUndo: false, canRedo: false, undoLabel: "", redoLabel: "" },
    gitStatus: "",
    imageGeneration: { available: false, mode: "vercel-readonly" },
    vercelCommand: process.env.LP_VERCEL_COMMAND || "npx vercel --prod --yes"
  };
}

async function buildLoopSections(includeAssets = false) {
  const html = await readText(LP_HTML_PATH).catch(() => "");
  const sections = LOOP_DEFS.map(([id, label, marker], index) => {
    const htmlOrder = html.indexOf(marker);
    const imageSrc = marker.includes("/") ? `images/${marker}` : "";
    return {
      id,
      label,
      sectionClass: marker.includes("/") ? "" : marker,
      htmlOrder: htmlOrder >= 0 ? htmlOrder : 100000 + index,
      backgroundSrc: imageSrc,
      background: imageSrc ? {
        src: imageSrc,
        url: `/lp-assets/${imageSrc}`,
        name: path.basename(imageSrc),
        title: label,
        group: path.dirname(imageSrc).replace(/^images\//, ""),
        exists: true
      } : null,
      tracks: [],
      mediaItems: []
    };
  });
  return { sections, assets: includeAssets ? [] : [] };
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "https://gui.local");
    if (req.method === "GET" && url.pathname === "/api/state") {
      return sendJson(res, await buildState());
    }
    if (req.method === "GET" && url.pathname === "/api/loop-sections") {
      return sendJson(res, await buildLoopSections(url.searchParams.get("assets") === "1"));
    }
    if (req.method === "GET" && url.pathname === "/api/ref-images") {
      return sendJson(res, { refImages: [] });
    }
    if (req.method === "GET" && url.pathname === "/api/global-prompt-rules") {
      return sendJson(res, { rules: "" });
    }
    if (req.method === "GET" && url.pathname === "/api/link-areas/url-presets") {
      return sendJson(res, { presets: [] });
    }
    if (req.method === "GET" && url.pathname === "/api/compositions/selected") {
      return sendJson(res, { selected: {} });
    }
    return sendJson(res, { error: "Vercel上のGUIは表示確認用です。編集・生成はローカルGUIで実行してください。" }, 404);
  } catch (error) {
    return sendJson(res, { error: error instanceof Error ? error.message : String(error) }, 500);
  }
}
