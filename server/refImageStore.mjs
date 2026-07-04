/**
 * 参照画像（プロンプト内で [ref:名前] として使う画像）の管理層です。
 * .lp-editor/ref-images/ に保存し、index.json でメタデータを管理します。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "./codexImageClient.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const REF_IMAGE_DIR = path.join(REPO_ROOT, ".lp-editor", "ref-images");
const REF_IMAGE_INDEX_PATH = path.join(REF_IMAGE_DIR, "index.json");

async function pathExists(target) {
  try { await fs.access(target); return true; } catch { return false; }
}

async function loadIndex() {
  if (!(await pathExists(REF_IMAGE_INDEX_PATH))) return [];
  try {
    return JSON.parse(await fs.readFile(REF_IMAGE_INDEX_PATH, "utf8"));
  } catch { return []; }
}

async function saveIndex(items) {
  await fs.mkdir(REF_IMAGE_DIR, { recursive: true });
  await fs.writeFile(REF_IMAGE_INDEX_PATH, JSON.stringify(items, null, 2) + "\n", "utf8");
}

function sanitizeName(name) {
  return String(name || "").replace(/[^\w぀-鿿゠-ヿ＀-￯ _-]/g, "").trim().slice(0, 64);
}

function normalizeChoice(value, allowed, fallback) {
  const text = String(value || "");
  return allowed.has(text) ? text : fallback;
}

function imageMimeType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return "image/png";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return "image/png";
}

function buildReferenceImagePrompt({ name, scope, assetKind, prompt, styleInstruction }) {
  const scopeLabel = scope === "style" ? "style-specific reference material" : "global reusable reference material";
  const kindLabel = {
    background: "background material",
    person: "person / character reference material",
    button: "button / clickable CTA reference material",
    object: "object, UI part, icon, or decorative material",
    texture: "texture, pattern, or mood board material"
  }[assetKind] ?? "reference material";

  const parts = [
    "Reference image generation task for a Japanese landing-page editor.",
    "",
    `Reference asset name: ${name}`,
    `Scope: ${scopeLabel}`,
    `Asset kind: ${kindLabel}`,
    "",
    "Create one clean reusable reference asset for future LP image prompts.",
    "The image must be useful as a visual reference, not as a finished LP section.",
    "Avoid dense readable copy. If text is necessary, use only simple labels or no text.",
    "Use a simple composition with clear subject, style, colors, lighting, and material details.",
    "Prefer a square or portrait-friendly composition that can be cropped safely.",
    ""
  ];

  if (scope === "global") {
    parts.push("Global rule: make this asset broadly reusable across multiple LP sections.");
    parts.push("Do not lock the image to one specific section unless the user prompt says so.");
    parts.push("");
  } else {
    parts.push("Style rule: make this asset a strong reference for the visual style below.");
    parts.push("--- style direction ---");
    parts.push(styleInstruction || "(no additional style direction)");
    parts.push("---");
    parts.push("");
  }

  if (assetKind === "background") {
    parts.push("Background asset requirements: prioritize atmosphere, color palette, depth, negative space, and non-distracting details.");
  } else if (assetKind === "person") {
    parts.push("Person asset requirements: create a natural, high-quality person reference with clear face, outfit, pose, lighting, and trustworthiness. Avoid celebrity likeness.");
  } else if (assetKind === "button") {
    parts.push("Button asset requirements: create a clean CTA/button reference with clear shape, spacing, color, hover-like affordance, and enough blank area around it for later link-area mapping.");
  } else if (assetKind === "object") {
    parts.push("Object/UI asset requirements: create a clear isolated reusable visual component with clean edges and simple background.");
  } else if (assetKind === "texture") {
    parts.push("Texture asset requirements: create a cohesive pattern, material sample, or mood texture that can guide later designs.");
  }

  parts.push("");
  parts.push("User prompt:");
  parts.push("---");
  parts.push(prompt.trim());
  parts.push("---");

  return parts.join("\n");
}

export async function getRefImages() {
  const items = await loadIndex();
  return items.map((item) => ({
    name: item.name,
    filename: item.filename,
    createdAt: item.createdAt,
    source: item.source || "upload",
    scope: item.scope || "global",
    assetKind: item.assetKind || "",
    styleInstruction: item.styleInstruction || "",
    prompt: item.prompt || "",
    revisedPrompt: item.revisedPrompt || "",
    model: item.model || "",
    transport: item.transport || "",
    url: `/ref-image-assets/${encodeURIComponent(item.filename)}`
  }));
}

export async function saveRefImage(name, dataUrl, metadata = {}) {
  const safeName = sanitizeName(name);
  if (!safeName) throw new Error("画像参照名が正しくありません。");

  const match = String(dataUrl || "").match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) throw new Error("画像データを読み取れませんでした。");

  const mimeType = match[1].toLowerCase();
  const ext = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1] || "png";
  const filename = `${Date.now()}-${safeName}.${ext}`;
  const buffer = Buffer.from(match[2], "base64");

  await fs.mkdir(REF_IMAGE_DIR, { recursive: true });
  await fs.writeFile(path.join(REF_IMAGE_DIR, filename), buffer);

  const items = await loadIndex();
  const existingIndex = items.findIndex((item) => item.name === safeName);
  const entry = {
    name: safeName,
    filename,
    createdAt: new Date().toISOString(),
    source: metadata.source || "upload",
    scope: metadata.scope || "global",
    assetKind: metadata.assetKind || "",
    styleInstruction: metadata.styleInstruction || "",
    prompt: metadata.prompt || "",
    revisedPrompt: metadata.revisedPrompt || "",
    model: metadata.model || "",
    transport: metadata.transport || ""
  };

  if (existingIndex >= 0) {
    try { await fs.unlink(path.join(REF_IMAGE_DIR, items[existingIndex].filename)); } catch { /* 旧ファイル削除失敗は無視 */ }
    items[existingIndex] = entry;
  } else {
    items.push(entry);
  }
  await saveIndex(items);
  return entry;
}

export async function generateRefImage({ name, scope, assetKind, prompt, styleInstruction }) {
  const safeName = sanitizeName(name);
  if (!safeName) throw new Error("参照画像名を入力してください。");
  const cleanPrompt = String(prompt || "").trim();
  if (!cleanPrompt) throw new Error("生成プロンプトを入力してください。");

  const normalizedScope = normalizeChoice(scope, new Set(["global", "style"]), "global");
  const normalizedKind = normalizeChoice(assetKind, new Set(["background", "person", "button", "object", "texture"]), "background");
  const cleanStyleInstruction = String(styleInstruction || "").trim();
  if (normalizedScope === "style" && !cleanStyleInstruction) {
    throw new Error("画風別素材では、画風ルールを入力してください。");
  }

  const imagePrompt = buildReferenceImagePrompt({
    name: safeName,
    scope: normalizedScope,
    assetKind: normalizedKind,
    prompt: cleanPrompt,
    styleInstruction: cleanStyleInstruction
  });

  const generated = await generateImageWithCodexAppServer({
    prompt: imagePrompt,
    sectionId: `REF-${normalizedScope}-${normalizedKind}`,
    imageName: `${safeName}.png`,
    refImages: [],
    cwd: REPO_ROOT,
    taskType: "reference"
  });

  const mimeType = imageMimeType(generated.buffer);
  const dataUrl = `data:${mimeType};base64,${generated.buffer.toString("base64")}`;
  const refImage = await saveRefImage(safeName, dataUrl, {
    source: "generated",
    scope: normalizedScope,
    assetKind: normalizedKind,
    styleInstruction: cleanStyleInstruction,
    prompt: cleanPrompt,
    revisedPrompt: generated.revisedPrompt || "",
    model: generated.model || "",
    transport: generated.transport || ""
  });

  return {
    refImage,
    model: generated.model,
    transport: generated.transport,
    scope: normalizedScope,
    assetKind: normalizedKind
  };
}

export async function deleteRefImage(name) {
  const items = await loadIndex();
  const idx = items.findIndex((item) => item.name === name);
  if (idx < 0) throw new Error("指定された参照画像が見つかりません。");
  const [removed] = items.splice(idx, 1);
  try { await fs.unlink(path.join(REF_IMAGE_DIR, removed.filename)); } catch { /* ファイル削除失敗は無視 */ }
  await saveIndex(items);
}

export async function getRefImageBuffer(name) {
  const items = await loadIndex();
  const item = items.find((i) => i.name === name);
  if (!item) return null;
  const filePath = path.join(REF_IMAGE_DIR, item.filename);
  if (!(await pathExists(filePath))) return null;
  return fs.readFile(filePath);
}

export { REF_IMAGE_DIR };
