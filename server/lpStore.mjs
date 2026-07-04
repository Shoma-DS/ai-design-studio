/**
 * LP編集GUIのローカル保存層です。
 * Markdownのセクション、画像ファイル、Vercel公開用の連結PNGを扱います。
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFile, exec } from "node:child_process";
import { promisify } from "node:util";
import { PNG } from "pngjs";
import {
  generateImageWithCodexAppServer,
  generateTextWithCodexAppServer,
  buildPromptRegenerationInstruction,
  buildBulkPromptRegenerationInstruction,
  buildCopyRegenerationInstruction,
  buildBulkCopyRegenerationInstruction,
  getCodexImageServerStatus
} from "./codexImageClient.mjs";
import { getRefImageBuffer } from "./refImageStore.mjs";
import { getComposition, getCompositionBuffer } from "./compositionStore.mjs";
import { getTestimonialSlides, TESTIMONIAL_SECTION_ID } from "./testimonialStore.mjs";

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "..");

const PROJECT_ROOT = path.join(REPO_ROOT, "projects", "ai-income-course");
const LP_VERSION_ROOT = path.join(PROJECT_ROOT, "ver01-fresh-green");
const LP_DIR = path.join(LP_VERSION_ROOT, "lp");
const LP_HTML_PATH = path.join(LP_DIR, "index.html");
const COPY_PATH = path.join(LP_DIR, "copy", "lp-copy-v3.md");
const FALLBACK_COPY_PATH = path.join(PROJECT_ROOT, "LP原稿.md");
const PROMPT_PATH = path.join(LP_VERSION_ROOT, "section-image-prompts.md");
const IMAGE_DIR = path.join(LP_DIR, "images");
const FULL_IMAGE_PATH = path.join(IMAGE_DIR, "lp-full.png");
export const HISTORY_ROOT = path.join(REPO_ROOT, ".lp-editor", "history");
const GENERATED_PROMPT_ROOT = path.join(REPO_ROOT, ".lp-editor", "generated-prompts");
const GLOBAL_PROMPT_RULES_PATH = path.join(REPO_ROOT, ".lp-editor", "global-prompt-rules.txt");
const OPERATION_ROOT = path.join(REPO_ROOT, ".lp-editor", "operations");
const OPERATION_STATE_PATH = path.join(OPERATION_ROOT, "state.json");
const STATE_SNAPSHOT_ROOT = path.join(REPO_ROOT, ".lp-editor", "state-snapshots");
const HISTORY_FIELDS = new Set(["copy", "prompt", "image"]);
const MAX_OPERATION_HISTORY = 50;

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

const safeText = (value) => (typeof value === "string" ? value : "");

function extractRefImageNames(text) {
  const names = [];
  for (const match of safeText(text).matchAll(/\[ref:([^\]\n]+)\]/g)) {
    const name = safeText(match[1]).trim();
    if (name && !names.includes(name)) names.push(name);
  }
  return names;
}

function normalizeHistoryField(value) {
  const field = typeof value === "string" ? value : "";
  return HISTORY_FIELDS.has(field) ? field : "";
}

function normalizeChangedFields(fields) {
  if (!Array.isArray(fields)) return [];
  return [...new Set(fields.filter((field) => HISTORY_FIELDS.has(field)))];
}

function changedFieldsFromReason(reason) {
  const value = safeText(reason);
  if (value.includes("image") || value.includes("alt-image")) return ["image"];
  return [];
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

function filesSnapshotEqual(left, right) {
  return left?.copy === right?.copy && left?.prompt === right?.prompt;
}

async function readEditableSnapshot() {
  const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
  const [copy, prompt] = await Promise.all([readText(copyPath), readText(PROMPT_PATH)]);
  return {
    copyPath: relativeFromRepo(copyPath),
    promptPath: relativeFromRepo(PROMPT_PATH),
    copy,
    prompt
  };
}

function resolveEditablePath(relativePath, allowedPaths) {
  const resolved = path.resolve(REPO_ROOT, safeText(relativePath));
  const allowed = allowedPaths.map((item) => path.resolve(item));
  if (!allowed.includes(resolved)) {
    throw new Error("操作履歴の対象ファイルが正しくありません。");
  }
  return resolved;
}

async function writeEditableSnapshot(snapshot) {
  const copyPath = resolveEditablePath(snapshot.copyPath, [COPY_PATH, FALLBACK_COPY_PATH]);
  const promptPath = resolveEditablePath(snapshot.promptPath, [PROMPT_PATH]);
  await Promise.all([
    fs.writeFile(copyPath, safeText(snapshot.copy), "utf8"),
    fs.writeFile(promptPath, safeText(snapshot.prompt), "utf8")
  ]);
}

function normalizeOperationState(state) {
  return {
    undo: Array.isArray(state?.undo) ? state.undo.filter(Boolean) : [],
    redo: Array.isArray(state?.redo) ? state.redo.filter(Boolean) : []
  };
}

function safeFileKey(value, fallback = "snapshot") {
  return safeText(value)
    .trim()
    .replace(/[^0-9a-zA-Z._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallback;
}

function normalizeLabels(value) {
  const source = Array.isArray(value)
    ? value
    : safeText(value).split(/[,\n、]/);
  return [...new Set(source.map((item) => safeText(item).trim()).filter(Boolean))].slice(0, 12);
}

function normalizeStateSnapshotDrafts(value) {
  if (!value || typeof value !== "object") return {};
  const drafts = {};
  for (const [rawId, draft] of Object.entries(value)) {
    const id = normalizeId(rawId);
    if (!id || !draft || typeof draft !== "object") continue;
    drafts[id] = {};
    if (Object.prototype.hasOwnProperty.call(draft, "copy")) drafts[id].copy = safeText(draft.copy);
    if (Object.prototype.hasOwnProperty.call(draft, "prompt")) drafts[id].prompt = safeText(draft.prompt);
  }
  return drafts;
}

async function readOperationState() {
  try {
    return normalizeOperationState(JSON.parse(await readText(OPERATION_STATE_PATH)));
  } catch {
    return { undo: [], redo: [] };
  }
}

async function writeOperationState(state) {
  await fs.mkdir(OPERATION_ROOT, { recursive: true });
  await fs.writeFile(OPERATION_STATE_PATH, `${JSON.stringify(normalizeOperationState(state), null, 2)}\n`, "utf8");
}

async function readOperation(id) {
  const safeId = String(id || "").replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeId) return null;
  try {
    return JSON.parse(await readText(path.join(OPERATION_ROOT, `${safeId}.json`)));
  } catch {
    return null;
  }
}

async function operationSummary(id) {
  const operation = await readOperation(id);
  if (!operation) return null;
  return {
    id: operation.id,
    label: operation.label,
    createdAt: operation.createdAt
  };
}

async function getOperationHistory() {
  const state = await readOperationState();
  const undo = [];
  const redo = [];

  for (const id of state.undo) {
    const summary = await operationSummary(id);
    if (summary) undo.push(summary);
  }
  for (const id of state.redo) {
    const summary = await operationSummary(id);
    if (summary) redo.push(summary);
  }

  return {
    canUndo: undo.length > 0,
    canRedo: redo.length > 0,
    undoLabel: undo.at(-1)?.label ?? "",
    redoLabel: redo.at(-1)?.label ?? "",
    undoCount: undo.length,
    redoCount: redo.length
  };
}

async function pushOperation(label, before, after) {
  const id = `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomUUID().slice(0, 8)}`;
  const operation = {
    id,
    label,
    createdAt: new Date().toISOString(),
    before,
    after
  };

  await fs.mkdir(OPERATION_ROOT, { recursive: true });
  await fs.writeFile(path.join(OPERATION_ROOT, `${id}.json`), `${JSON.stringify(operation, null, 2)}\n`, "utf8");
  const state = await readOperationState();
  await writeOperationState({
    undo: [...state.undo, id].slice(-MAX_OPERATION_HISTORY),
    redo: []
  });
}

async function attachOperationHistory(result) {
  if (result && typeof result === "object" && Array.isArray(result.sections)) {
    return {
      ...result,
      operationHistory: await getOperationHistory()
    };
  }
  return result;
}

async function recordFileOperation(label, action) {
  const before = await readEditableSnapshot();
  let result = await action();
  const after = await readEditableSnapshot();

  if (!filesSnapshotEqual(before, after)) {
    await pushOperation(label, before, after);
  }

  result = await attachOperationHistory(result);
  return result;
}

async function restoreOperation(direction) {
  const state = await readOperationState();
  const fromKey = direction === "redo" ? "redo" : "undo";
  const toKey = direction === "redo" ? "undo" : "redo";
  const stack = [...state[fromKey]];
  const id = stack.pop();

  if (!id) {
    throw new Error(direction === "redo" ? "やり直せる操作がありません。" : "戻せる操作がありません。");
  }

  const operation = await readOperation(id);
  if (!operation) {
    throw new Error("操作履歴を読み込めませんでした。");
  }

  const current = await readEditableSnapshot();
  const expected = direction === "redo" ? operation.before : operation.after;
  if (!filesSnapshotEqual(current, expected)) {
    throw new Error("ファイルの最新状態が操作履歴と一致しないため、Undo/Redoを中止しました。再読み込みして差分を確認してください。");
  }

  await writeEditableSnapshot(direction === "redo" ? operation.after : operation.before);
  await writeOperationState({
    ...state,
    [fromKey]: stack,
    [toKey]: [...state[toKey], id].slice(-MAX_OPERATION_HISTORY)
  });

  return attachOperationHistory(await buildSections());
}

function normalizeId(value) {
  const raw = String(value || "").trim();
  const sec = raw.match(/^SEC[-\s]?(\d{1,2})([a-z])?/i);
  if (sec) {
    return `SEC-${sec[1].padStart(2, "0")}${sec[2] ? sec[2].toLowerCase() : ""}`;
  }

  const numbered = raw.match(/^(\d{1,2})([a-z])?\b/i);
  if (numbered) {
    return `SEC-${numbered[1].padStart(2, "0")}${numbered[2] ? numbered[2].toLowerCase() : ""}`;
  }

  return raw.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
}

function sectionTitleFromHeader(header) {
  return header
    .replace(/^SEC[-\s]?\d{1,2}[a-z]?\s*[｜|-]?\s*/i, "")
    .replace(/^\d{1,2}[a-z]?\s*/, "")
    .trim();
}

function parseMarkdownSections(markdown, idFromHeader) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  const sections = new Map();
  const order = [];

  matches.forEach((match, index) => {
    const header = match[1].trim();
    const start = match.index;
    const contentStart = start + match[0].length;
    const nextStart = matches[index + 1]?.index ?? markdown.length;
    const id = idFromHeader(header);
    const content = markdown.slice(contentStart, nextStart).replace(/^\n+/, "").replace(/\n+$/, "");

    sections.set(id, {
      id,
      header,
      title: sectionTitleFromHeader(header),
      content,
      start,
      contentStart,
      end: nextStart
    });
    order.push(id);
  });

  return {
    preamble: matches[0] ? markdown.slice(0, matches[0].index) : markdown,
    sections,
    order
  };
}

function parseEditableSections(markdown) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  const firstSec = matches.find((match) => /^SEC-\d{2}/.test(normalizeId(match[1])));
  if (!firstSec) {
    return {
      preamble: markdown,
      sections: new Map(),
      order: []
    };
  }

  const parsed = parseMarkdownSections(markdown.slice(firstSec.index), normalizeId);
  return {
    ...parsed,
    preamble: markdown.slice(0, firstSec.index),
    order: parsed.order.filter((id) => /^SEC-\d{2}/.test(id))
  };
}

function replaceSection(markdown, id, nextContent, idFromHeader) {
  const parsed = parseMarkdownSections(markdown, idFromHeader);
  const section = parsed.sections.get(id);
  if (!section) {
    throw new Error(`セクション ${id} が見つかりません。`);
  }

  const normalized = safeText(nextContent).replace(/\s+$/, "");
  return `${markdown.slice(0, section.contentStart)}\n\n${normalized}\n${markdown.slice(section.end)}`;
}

function stripSectionDivider(content) {
  return safeText(content).replace(/\n+---\s*$/g, "").replace(/\s+$/, "");
}

function normalizeImageName(value, id = "") {
  const raw = safeText(value).trim();
  if (!raw) {
    const suffix = id.replace(/^SEC-/i, "").replace(/[^0-9a-z]+/gi, "_").toLowerCase();
    return `IMG_section_${suffix || "new"}.png`;
  }
  const base = raw
    .replace(/^`|`$/g, "")
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/[^0-9a-zA-Z_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "IMG_section"}.png`;
}

function promptTableLayer(imageName) {
  return normalizeImageName(imageName).replace(/\.(png|jpe?g|webp)$/i, "");
}

function formatPromptHeader(id, title) {
  return `## ${id} ｜ ${safeText(title).trim() || id}`;
}

function formatCopyHeader(id, title) {
  const displayId = id.replace(/^SEC-/i, "");
  return `## ${displayId} ${safeText(title).trim() || id}`;
}

function defaultCopyContent(title) {
  const heading = safeText(title).trim() || "新規セクション";
  return [
    "**見出し**",
    heading,
    "",
    "**本文**",
    "ここにLP原稿を入力してください。"
  ].join("\n");
}

function defaultPromptContent(title) {
  return [
    "```",
    "Create a polished vertical landing-page section image for this section.",
    `Section theme: ${safeText(title).trim() || "New section"}`,
    "Use a clean, conversion-oriented Japanese LP design with clear hierarchy.",
    "```"
  ].join("\n");
}

function replaceSectionStructureTable(promptRaw, items) {
  const lines = promptRaw.split(/\r?\n/);
  const tableStart = lines.findIndex((line) => /^\|\s*SEC ID\s*\|/i.test(line));
  if (tableStart === -1) return promptRaw;

  let tableEnd = tableStart;
  while (tableEnd < lines.length && /^\|/.test(lines[tableEnd])) {
    tableEnd += 1;
  }

  const tableRows = [
    "| SEC ID | セクション | 枚数 | Figmaレイヤー名 |",
    "|--------|-----------|------|----------------|",
    ...items.map((item) => `| ${item.id} | ${item.title} | 1 | \`${promptTableLayer(item.imageName)}\` |`)
  ];

  return [
    ...lines.slice(0, tableStart),
    ...tableRows,
    ...lines.slice(tableEnd)
  ].join("\n");
}

function normalizeStructureItems(items) {
  if (!Array.isArray(items)) {
    throw new Error("セクション構成が正しくありません。");
  }

  const normalized = items
    .map((item) => {
      const id = normalizeId(item?.id);
      const originalId = item?.originalId ? normalizeId(item.originalId) : id;
      const title = safeText(item?.title).trim() || id;
      const imageName = normalizeImageName(item?.imageName, id);
      return {
        id,
        originalId,
        title,
        imageName,
        copy: Object.prototype.hasOwnProperty.call(item ?? {}, "copy") ? safeText(item.copy) : null,
        prompt: Object.prototype.hasOwnProperty.call(item ?? {}, "prompt") ? safeText(item.prompt) : null
      };
    })
    .filter((item) => /^SEC-\d{2}[a-z]?$/.test(item.id));

  if (!normalized.length) {
    throw new Error("セクションは1件以上必要です。");
  }

  const ids = new Set();
  for (const item of normalized) {
    if (ids.has(item.id)) {
      throw new Error(`セクションIDが重複しています: ${item.id}`);
    }
    ids.add(item.id);
  }

  return normalized;
}

function sourceSection(parsed, item, isCopy = false) {
  const sourceIds = [
    item.originalId,
    item.id,
    isCopy ? copyIdForSection(item.originalId) : "",
    isCopy ? copyIdForSection(item.id) : ""
  ].filter(Boolean);
  for (const id of sourceIds) {
    const section = parsed.sections.get(id);
    if (section) return section;
  }
  return null;
}

function buildPromptMarkdownWithStructure(promptRaw, items) {
  const parsed = parseEditableSections(promptRaw);
  const preamble = replaceSectionStructureTable(parsed.preamble, items).replace(/\s+$/, "");
  const blocks = items.map((item) => {
    const existing = sourceSection(parsed, item);
    const content = item.prompt !== null
      ? item.prompt
      : existing
        ? stripSectionDivider(existing.content)
        : defaultPromptContent(item.title);
    const header = existing && item.id === item.originalId
      ? existing.header
      : formatPromptHeader(item.id, item.title);
    return `${header}\n\n${stripSectionDivider(content)}`;
  });

  return `${preamble}\n\n${blocks.join("\n\n---\n\n")}\n`;
}

function buildCopyMarkdownWithStructure(copyRaw, items) {
  const parsed = parseEditableSections(copyRaw);
  const preamble = parsed.preamble.replace(/\s+$/, "");
  const blocks = items.map((item) => {
    const existing = sourceSection(parsed, item, true);
    const content = item.copy !== null
      ? item.copy
      : existing
        ? stripSectionDivider(existing.content)
        : defaultCopyContent(item.title);
    const header = existing && item.id === item.originalId
      ? existing.header
      : formatCopyHeader(item.id, item.title);
    return `${header}\n\n${stripSectionDivider(content)}`;
  });

  return `${preamble}\n\n${blocks.join("\n\n---\n\n")}\n`;
}

function imageNameFromLayer(layerName) {
  if (!layerName) return "";
  return layerName.endsWith(".png") ? layerName : `${layerName}.png`;
}

function copyIdForSection(id) {
  return COPY_ID_OVERRIDES.get(id) ?? id;
}

function parseImageTable(promptRaw) {
  const rows = new Map();
  const rowRegex = /^\|\s*(SEC-\d{2}[a-z]?)\s*\|\s*([^|]+?)\s*\|\s*[^|]*\|\s*`?([^`|\s]+)`?\s*\|/gim;
  for (const match of promptRaw.matchAll(rowRegex)) {
    rows.set(match[1], {
      id: match[1],
      title: match[2].trim(),
      imageName: imageNameFromLayer(match[3].trim())
    });
  }
  return rows;
}

function imageOrderKey(imageName) {
  return path.basename(safeText(imageName)).replace(/\.[^.]+$/, "").toLowerCase();
}

async function readHtmlImageOrder() {
  let html = "";
  try {
    html = await readText(LP_HTML_PATH);
  } catch {
    return new Map();
  }

  const order = new Map();
  for (const match of html.matchAll(/<img\b[^>]*\bsrc=["']images\/([^"']+)["'][^>]*>/gi)) {
    const key = imageOrderKey(match[1]);
    if (key && !order.has(key)) order.set(key, match.index);
  }
  return order;
}

function relativeFromRepo(target) {
  return path.relative(REPO_ROOT, target);
}

function publicAssetUrl(relativePath) {
  const publicUrl = process.env.LP_PUBLIC_URL || "";
  if (!publicUrl) return "";
  try {
    const base = /\/$|\.[a-z0-9]+($|\?)/i.test(publicUrl) ? publicUrl : `${publicUrl}/`;
    return new URL(relativePath.split(path.sep).join("/"), base).toString();
  } catch {
    return "";
  }
}

async function getImageMeta(target) {
  if (!(await pathExists(target))) return null;
  const stat = await fs.stat(target);
  try {
    const { stdout } = await execFileAsync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", target], {
      timeout: 1000 * 10
    });
    const width = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);
    const height = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);
    return {
      width,
      height,
      size: stat.size,
      mtime: stat.mtimeMs
    };
  } catch {
    return {
      width: null,
      height: null,
      size: stat.size,
      mtime: stat.mtimeMs
    };
  }
}

async function getFileMtime(target) {
  try {
    return (await fs.stat(target)).mtimeMs;
  } catch {
    return Date.now();
  }
}

async function buildSections() {
  const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
  const [copyRaw, promptRaw, htmlImageOrder, testimonialResult, htmlMtime] = await Promise.all([
    readText(copyPath),
    readText(PROMPT_PATH),
    readHtmlImageOrder(),
    getTestimonialSlides(),
    getFileMtime(LP_HTML_PATH)
  ]);
  const testimonialSlides = testimonialResult.slides ?? [];
  const testimonialStoryNav = testimonialResult.storyNav ?? {};
  const copyParsed = parseMarkdownSections(copyRaw, normalizeId);
  const promptParsed = parseMarkdownSections(promptRaw, normalizeId);
  const imageTable = parseImageTable(promptRaw);
  const fallbackImages = new Map(SECTION_IMAGE_FALLBACKS.map(([id, layer]) => [id, imageNameFromLayer(layer)]));
  const promptIds = promptParsed.order.filter((id) => /^SEC-\d{2}/.test(id));
  const ids = promptIds.length ? promptIds : SECTION_IMAGE_FALLBACKS.map(([id]) => id);

  const sections = [];
  for (const id of ids) {
    const promptSection = promptParsed.sections.get(id);
    const copySection = copyParsed.sections.get(copyIdForSection(id));
    const isTestimonialSection = id === TESTIMONIAL_SECTION_ID;
    const imageName = isTestimonialSection
      ? (testimonialSlides[0]?.backgroundImageName ?? "")
      : imageTable.get(id)?.imageName ?? fallbackImages.get(id) ?? "";
    const imagePath = path.join(IMAGE_DIR, imageName);
    const imageMeta = await getImageMeta(imagePath);
    const htmlOrder = htmlImageOrder.get(imageOrderKey(imageName));
    sections.push({
      id,
      title: imageTable.get(id)?.title ?? promptSection?.title ?? copySection?.title ?? id,
      copyHeader: copySection?.header ?? "",
      promptHeader: promptSection?.header ?? "",
      copy: copySection?.content ?? "",
      prompt: promptSection?.content ?? "",
      imageName,
      imagePath: imageName ? relativeFromRepo(imagePath) : "",
      imageUrl: imageName ? `/lp-assets/images/${imageName}?v=${imageMeta?.mtime ?? htmlMtime}` : "",
      publicImageUrl: imageName ? publicAssetUrl(`images/${imageName}`) : "",
      htmlOrder: Number.isFinite(htmlOrder) ? htmlOrder : null,
      imageMeta,
      ...(isTestimonialSection ? { testimonialSlides, testimonialStoryNav } : {})
    });
  }

  return {
    project: {
      name: "最新AI活用 完全マスター講座",
      copyPath: relativeFromRepo(copyPath),
      promptPath: relativeFromRepo(PROMPT_PATH),
      imageDir: relativeFromRepo(IMAGE_DIR),
      lpDir: relativeFromRepo(LP_DIR),
      lpHtmlPath: relativeFromRepo(LP_HTML_PATH),
      lpHtmlUrl: `/lp-assets/index.html?v=${htmlMtime}`,
      fullImagePath: relativeFromRepo(FULL_IMAGE_PATH),
      fullImageUrl: `/lp-assets/images/lp-full.png?v=${(await getImageMeta(FULL_IMAGE_PATH))?.mtime ?? Date.now()}`,
      publicUrl: process.env.LP_PUBLIC_URL || "",
      fullPublicImageUrl: publicAssetUrl("images/lp-full.png")
    },
    sections,
    operationHistory: await getOperationHistory()
  };
}

function stateSnapshotDir(id) {
  const safeId = String(id || "").replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeId) throw new Error("全体スナップショットIDが正しくありません。");
  const dir = path.resolve(STATE_SNAPSHOT_ROOT, safeId);
  const root = path.resolve(STATE_SNAPSHOT_ROOT);
  if (dir !== root && !dir.startsWith(`${root}${path.sep}`)) {
    throw new Error("全体スナップショットIDが正しくありません。");
  }
  return dir;
}

function publicStateSnapshot(manifest) {
  return {
    id: manifest.id,
    title: manifest.title,
    labels: normalizeLabels(manifest.labels),
    note: safeText(manifest.note),
    createdAt: manifest.createdAt,
    sectionCount: Array.isArray(manifest.sections) ? manifest.sections.length : 0,
    imageCount: Array.isArray(manifest.images) ? manifest.images.length : 0,
    copyPath: manifest.copyPath || "",
    promptPath: manifest.promptPath || ""
  };
}

async function readStateSnapshotManifest(id) {
  const dir = stateSnapshotDir(id);
  const manifestPath = path.join(dir, "snapshot.json");
  if (!(await pathExists(manifestPath))) {
    throw new Error("指定された全体スナップショットが見つかりません。");
  }
  return {
    dir,
    manifest: JSON.parse(await readText(manifestPath))
  };
}

async function listStateSnapshots() {
  if (!(await pathExists(STATE_SNAPSHOT_ROOT))) return [];
  const entries = await fs.readdir(STATE_SNAPSHOT_ROOT, { withFileTypes: true });
  const snapshots = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const { manifest } = await readStateSnapshotManifest(entry.name);
      snapshots.push(publicStateSnapshot(manifest));
    } catch {
      // 壊れたスナップショットは一覧表示を止めない。
    }
  }
  return snapshots.sort((a, b) => safeText(b.createdAt).localeCompare(safeText(a.createdAt)));
}

async function createStateSnapshot(payload = {}) {
  const state = await buildSections();
  const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
  const title = safeText(payload.title).trim() || `全体状態 ${new Date().toLocaleString("ja-JP")}`;
  const labels = normalizeLabels(payload.labels);
  const note = safeText(payload.note).trim();
  const sectionDrafts = normalizeStateSnapshotDrafts(payload.sectionDrafts);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const id = `${stamp}-${crypto.randomUUID().slice(0, 8)}-${safeFileKey(title)}`;
  const dir = stateSnapshotDir(id);
  const imagesDir = path.join(dir, "images");

  await fs.mkdir(imagesDir, { recursive: true });

  let snapshotCopyRaw = await readText(copyPath);
  let snapshotPromptRaw = await readText(PROMPT_PATH);
  for (const section of state.sections) {
    const draft = sectionDrafts[section.id];
    if (!draft) continue;
    if (Object.prototype.hasOwnProperty.call(draft, "copy") && draft.copy !== section.copy) {
      snapshotCopyRaw = replaceSection(snapshotCopyRaw, copyIdForSection(section.id), draft.copy, normalizeId);
    }
    if (Object.prototype.hasOwnProperty.call(draft, "prompt") && draft.prompt !== section.prompt) {
      snapshotPromptRaw = replaceSection(snapshotPromptRaw, section.id, draft.prompt, normalizeId);
    }
  }

  await Promise.all([
    fs.writeFile(path.join(dir, "copy.md"), snapshotCopyRaw, "utf8"),
    fs.writeFile(path.join(dir, "section-image-prompts.md"), snapshotPromptRaw, "utf8")
  ]);

  const imagesByName = new Map();
  for (const section of state.sections) {
    if (!section.imageName || !section.imagePath) continue;
    const sourcePath = path.resolve(REPO_ROOT, section.imagePath);
    if (!(await pathExists(sourcePath))) continue;
    const current = imagesByName.get(section.imageName) ?? {
      imageName: section.imageName,
      fileName: `${safeFileKey(section.id)}-${safeFileKey(path.basename(section.imageName), "image.png")}`,
      sectionIds: []
    };
    current.sectionIds.push(section.id);
    imagesByName.set(section.imageName, current);
  }

  for (const item of imagesByName.values()) {
    const sourceSection = state.sections.find((section) => section.imageName === item.imageName);
    if (!sourceSection?.imagePath) continue;
    await fs.copyFile(path.resolve(REPO_ROOT, sourceSection.imagePath), path.join(imagesDir, item.fileName));
  }

  const manifest = {
    version: 1,
    id,
    title,
    labels,
    note,
    createdAt: new Date().toISOString(),
    copyPath: relativeFromRepo(copyPath),
    promptPath: relativeFromRepo(PROMPT_PATH),
    sections: state.sections.map((section) => ({
      id: section.id,
      title: section.title,
      copyHeader: section.copyHeader,
      promptHeader: section.promptHeader,
      imageName: section.imageName
    })),
    images: [...imagesByName.values()]
  };

  await fs.writeFile(path.join(dir, "snapshot.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return {
    snapshot: publicStateSnapshot(manifest),
    snapshots: await listStateSnapshots()
  };
}

async function restoreStateSnapshot(id) {
  const { dir, manifest } = await readStateSnapshotManifest(id);
  const copySource = path.join(dir, "copy.md");
  const promptSource = path.join(dir, "section-image-prompts.md");
  if (!(await pathExists(copySource)) || !(await pathExists(promptSource))) {
    throw new Error("全体スナップショットの原稿またはプロンプトファイルが見つかりません。");
  }

  const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
  await Promise.all([
    fs.copyFile(copySource, copyPath),
    fs.copyFile(promptSource, PROMPT_PATH),
    fs.mkdir(IMAGE_DIR, { recursive: true })
  ]);

  const imagesDir = path.join(dir, "images");
  for (const item of Array.isArray(manifest.images) ? manifest.images : []) {
    const imageName = normalizeImageName(item.imageName);
    const sourcePath = path.join(imagesDir, safeFileKey(item.fileName, ""));
    if (!imageName || !(await pathExists(sourcePath))) {
      throw new Error(`全体スナップショット内の画像が見つかりません: ${item.imageName || item.fileName || "(不明)"}`);
    }
    await fs.copyFile(sourcePath, path.join(IMAGE_DIR, imageName));
  }

  await rebuildFullImage();
  return attachOperationHistory(await buildSections());
}

async function deleteStateSnapshot(id) {
  await fs.rm(stateSnapshotDir(id), { recursive: true, force: true });
  return { snapshots: await listStateSnapshots() };
}

async function readCurrentSectionSnapshot(id) {
  const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
  const [copyRaw, promptRaw] = await Promise.all([readText(copyPath), readText(PROMPT_PATH)]);
  const copyParsed = parseMarkdownSections(copyRaw, normalizeId);
  const promptParsed = parseMarkdownSections(promptRaw, normalizeId);
  const imageTable = parseImageTable(promptRaw);
  const fallbackImages = new Map(SECTION_IMAGE_FALLBACKS.map(([sectionId, layer]) => [sectionId, imageNameFromLayer(layer)]));
  const promptSection = promptParsed.sections.get(id);
  const copySection = copyParsed.sections.get(copyIdForSection(id));
  const imageName = imageTable.get(id)?.imageName ?? fallbackImages.get(id) ?? "";

  return {
    id,
    copy: copySection?.content ?? "",
    prompt: promptSection?.content ?? "",
    imageName,
    imagePath: imageName ? relativeFromRepo(path.join(IMAGE_DIR, imageName)) : ""
  };
}

async function snapshotSection(id, reason = "save", changedFields = []) {
  const state = await buildSections();
  const section = state.sections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`セクション ${id} が見つかりません。`);
  }

  const dir = path.join(HISTORY_ROOT, id);
  await fs.mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const snapshot = {
    id,
    reason,
    createdAt: new Date().toISOString(),
    copy: section.copy,
    prompt: section.prompt,
    changedFields: normalizeChangedFields(changedFields),
    imageName: section.imageName,
    imagePath: section.imagePath
  };

  if (section.imagePath) {
    const sourceImage = path.join(REPO_ROOT, section.imagePath);
    if (await pathExists(sourceImage)) {
      const imageBackupName = `${stamp}-${section.imageName}`;
      await fs.copyFile(sourceImage, path.join(dir, imageBackupName));
      snapshot.imageBackup = imageBackupName;
    }
  }

  const jsonPath = path.join(dir, `${stamp}.json`);
  await fs.writeFile(jsonPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  return snapshot;
}

async function saveSection(id, payload) {
  return recordFileOperation(`保存 ${id}`, async () => {
    const state = await buildSections();
    const section = state.sections.find((item) => item.id === id);
    if (!section) {
      throw new Error(`セクション ${id} が見つかりません。`);
    }

    const changedFields = [];
    if (Object.prototype.hasOwnProperty.call(payload, "copy") && payload.copy !== section.copy) {
      changedFields.push("copy");
    }
    if (Object.prototype.hasOwnProperty.call(payload, "prompt") && payload.prompt !== section.prompt) {
      changedFields.push("prompt");
    }

    if (changedFields.length) {
      await snapshotSection(id, "before-save", changedFields);
    }
    const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;

    if (Object.prototype.hasOwnProperty.call(payload, "copy")) {
      const raw = await readText(copyPath);
      await fs.writeFile(copyPath, replaceSection(raw, copyIdForSection(id), payload.copy, normalizeId), "utf8");
    }

    if (Object.prototype.hasOwnProperty.call(payload, "prompt")) {
      const raw = await readText(PROMPT_PATH);
      await fs.writeFile(PROMPT_PATH, replaceSection(raw, id, payload.prompt, normalizeId), "utf8");
    }

    return buildSections();
  });
}

async function applySectionStructure(items, label = "セクション構成を変更") {
  const normalized = normalizeStructureItems(items);
  return recordFileOperation(label, async () => {
    const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
    const [copyRaw, promptRaw] = await Promise.all([readText(copyPath), readText(PROMPT_PATH)]);
    await Promise.all([
      fs.writeFile(copyPath, buildCopyMarkdownWithStructure(copyRaw, normalized), "utf8"),
      fs.writeFile(PROMPT_PATH, buildPromptMarkdownWithStructure(promptRaw, normalized), "utf8")
    ]);
    return buildSections();
  });
}

function nextSectionIdFromSections(sections) {
  const numbers = sections
    .map((section) => Number(section.id.match(/^SEC-(\d{2})/)?.[1] ?? 0))
    .filter((value) => Number.isFinite(value));
  const nextNumber = Math.max(0, ...numbers) + 1;
  return `SEC-${String(nextNumber).padStart(2, "0")}`;
}

async function addSection(payload = {}) {
  const state = await buildSections();
  const id = normalizeId(payload.id || nextSectionIdFromSections(state.sections));
  if (!/^SEC-\d{2}[a-z]?$/.test(id)) {
    throw new Error("セクションIDは SEC-15 または SEC-15a の形式で入力してください。");
  }
  if (state.sections.some((section) => section.id === id)) {
    throw new Error(`セクション ${id} はすでに存在します。`);
  }

  const newItem = {
    originalId: id,
    id,
    title: safeText(payload.title).trim() || id,
    imageName: normalizeImageName(payload.imageName, id),
    copy: safeText(payload.copy) || defaultCopyContent(payload.title || id),
    prompt: safeText(payload.prompt) || defaultPromptContent(payload.title || id)
  };
  const items = state.sections.map((section) => ({
    originalId: section.id,
    id: section.id,
    title: section.title,
    imageName: section.imageName
  }));
  const afterId = payload.afterId ? normalizeId(payload.afterId) : "";
  const index = afterId ? items.findIndex((item) => item.id === afterId) : -1;
  if (index === -1) {
    items.push(newItem);
  } else {
    items.splice(index + 1, 0, newItem);
  }

  return applySectionStructure(items, `セクション追加 ${id}`);
}

async function deleteSection(id) {
  const targetId = normalizeId(id);
  const state = await buildSections();
  if (!state.sections.some((section) => section.id === targetId)) {
    throw new Error(`セクション ${targetId} が見つかりません。`);
  }
  if (state.sections.length <= 1) {
    throw new Error("最後の1セクションは削除できません。");
  }

  const items = state.sections
    .filter((section) => section.id !== targetId)
    .map((section) => ({
      originalId: section.id,
      id: section.id,
      title: section.title,
      imageName: section.imageName
    }));

  return applySectionStructure(items, `セクション削除 ${targetId}`);
}

function snapshotImagePath(snapshot, dir) {
  if (snapshot.imageBackup) return path.join(dir, snapshot.imageBackup);
  if (snapshot.imagePath) return path.resolve(REPO_ROOT, snapshot.imagePath);
  return "";
}

async function filesHaveSameContent(left, right) {
  if (!left || !right) return false;
  const leftPath = left instanceof URL ? left : path.resolve(left);
  const rightPath = right instanceof URL ? right : path.resolve(right);
  if (String(leftPath) === String(rightPath)) return true;

  try {
    const [leftStat, rightStat] = await Promise.all([fs.stat(leftPath), fs.stat(rightPath)]);
    if (leftStat.size !== rightStat.size) return false;
    const [leftBuffer, rightBuffer] = await Promise.all([fs.readFile(leftPath), fs.readFile(rightPath)]);
    return leftBuffer.equals(rightBuffer);
  } catch {
    return false;
  }
}

async function inferChangedFields(snapshot, afterState, dir) {
  const reasonFields = changedFieldsFromReason(snapshot.reason);
  if (reasonFields.length) return reasonFields;

  const changedFields = [];

  if (typeof snapshot.copy === "string" && typeof afterState.copy === "string" && snapshot.copy !== afterState.copy) {
    changedFields.push("copy");
  }
  if (typeof snapshot.prompt === "string" && typeof afterState.prompt === "string" && snapshot.prompt !== afterState.prompt) {
    changedFields.push("prompt");
  }

  if (snapshot.reason === "before-save") {
    return changedFields;
  }

  const beforeImage = snapshotImagePath(snapshot, dir);
  const afterImage = snapshotImagePath(afterState, dir);
  if (beforeImage && afterImage && !(await filesHaveSameContent(beforeImage, afterImage))) {
    changedFields.push("image");
  }

  return changedFields;
}

async function listSnapshots(id, field = "") {
  const targetField = normalizeHistoryField(field);
  const dir = path.join(HISTORY_ROOT, id);
  if (!(await pathExists(dir))) return [];
  const files = (await fs.readdir(dir)).filter((file) => file.endsWith(".json")).sort();
  const currentSection = await readCurrentSectionSnapshot(id);
  const entries = [];

  for (const file of files) {
    try {
      const data = JSON.parse(await readText(path.join(dir, file)));
      entries.push({ file, data });
    } catch {
      // Corrupt local history should not block the editor.
    }
  }

  const snapshots = [];
  for (const [index, entry] of entries.entries()) {
    try {
      const { file, data } = entry;
      const afterState = entries[index + 1]?.data ?? currentSection;
      const imageBackupPath = data.imageBackup ? path.join(dir, data.imageBackup) : "";
      const imageMeta = imageBackupPath ? await getImageMeta(imageBackupPath) : null;
      const storedChangedFields = normalizeChangedFields(data.changedFields);
      const changedFields = storedChangedFields.length
        ? storedChangedFields
        : await inferChangedFields(data, afterState, dir);

      snapshots.push({
        ...data,
        snapshotFile: file,
        changedFields,
        imageBackupUrl: data.imageBackup
          ? `/history-assets/${encodeURIComponent(id)}/${encodeURIComponent(data.imageBackup)}?v=${imageMeta?.mtime ?? Date.now()}`
          : "",
        copyLength: safeText(data.copy).length,
        promptLength: safeText(data.prompt).length,
        imageMeta
      });
    } catch {
      // Corrupt local history should not block the editor.
    }
  }

  const newestFirst = snapshots.reverse();
  return targetField ? newestFirst.filter((snapshot) => snapshot.changedFields.includes(targetField)) : newestFirst;
}

async function readSnapshot(id, snapshotFile) {
  const snapshots = await listSnapshots(id);
  const snapshot = snapshots.find((item) => item.snapshotFile === snapshotFile);
  if (!snapshot) {
    throw new Error("指定された履歴が見つかりません。");
  }
  return snapshot;
}

async function restoreSnapshot(id, snapshotFile, field) {
  const snapshot = await readSnapshot(id, snapshotFile);

  if (field === "copy" || field === "prompt") {
    if (typeof snapshot[field] !== "string") {
      throw new Error("この履歴には戻せる内容がありません。");
    }
    return saveSection(id, { [field]: snapshot[field] });
  }

  if (field === "image") {
    if (!snapshot.imageBackup) {
      throw new Error("この履歴には戻せる画像がありません。");
    }
    const state = await buildSections();
    const section = state.sections.find((item) => item.id === id);
    if (!section?.imageName) {
      throw new Error(`セクション ${id} の画像名がありません。`);
    }
    await snapshotSection(id, "before-image-history-restore", ["image"]);
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "lp-editor-history-restore-"));
    try {
      const backupPath = path.join(HISTORY_ROOT, id, snapshot.imageBackup);
      const preparedPath = path.join(tempDir, section.imageName);
      await convertToPngWidth(backupPath, preparedPath, 1080);
      await applyPreparedImage(section, preparedPath);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
    return buildSections();
  }

  throw new Error("復元対象が正しくありません。");
}

async function gitShowFile(relativePath, encoding = "utf8") {
  const { stdout } = await execFileAsync("git", ["show", `HEAD:${relativePath}`], {
    cwd: REPO_ROOT,
    encoding,
    maxBuffer: 1024 * 1024 * 100,
    timeout: 1000 * 30
  });
  return stdout;
}

async function restoreSection(id, field) {
  const snapshots = await listSnapshots(id);
  const snapshot = snapshots.find((item) => field === "image" ? item.imageBackup : item[field]);

  if (field === "copy" || field === "prompt") {
    if (snapshot?.[field]) {
      return saveSection(id, { [field]: snapshot[field] });
    }

    const copyPath = (await pathExists(COPY_PATH)) ? COPY_PATH : FALLBACK_COPY_PATH;
    const targetPath = field === "copy" ? copyPath : PROMPT_PATH;
    const raw = await gitShowFile(relativeFromRepo(targetPath));
    const parsed = parseMarkdownSections(raw, normalizeId);
    const sectionId = field === "copy" ? copyIdForSection(id) : id;
    const previous = parsed.sections.get(sectionId)?.content;
    if (!previous) {
      throw new Error("Git履歴から戻せる内容がありません。");
    }
    return saveSection(id, { [field]: previous });
  }

  if (field === "image") {
    const state = await buildSections();
    const section = state.sections.find((item) => item.id === id);
    const imageName = snapshot?.imageName ?? section?.imageName;
    if (!imageName) {
      throw new Error("戻せる画像名がありません。");
    }
    await snapshotSection(id, "before-image-restore", ["image"]);
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "lp-editor-restore-"));
    try {
      const preparedPath = path.join(tempDir, imageName);
      if (snapshot?.imageBackup) {
        const backupPath = path.join(HISTORY_ROOT, id, snapshot.imageBackup);
        await convertToPngWidth(backupPath, preparedPath, 1080);
      } else {
        const targetPath = path.join(IMAGE_DIR, imageName);
        const buffer = await gitShowFile(relativeFromRepo(targetPath), "buffer");
        const headPath = path.join(tempDir, `head-${imageName}`);
        await fs.writeFile(headPath, buffer);
        await convertToPngWidth(headPath, preparedPath, 1080);
      }
      await applyPreparedImage(section, preparedPath);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
    return buildSections();
  }

  throw new Error("復元対象が正しくありません。");
}

function bufferFromDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("画像データを読み取れませんでした。");
  }
  return Buffer.from(match[2], "base64");
}

async function convertToPngWidth(inputPath, outputPath, width = 1080) {
  await execFileAsync("sips", ["-s", "format", "png", "--resampleWidth", String(width), inputPath, "--out", outputPath], {
    timeout: 1000 * 60,
    maxBuffer: 1024 * 1024 * 4
  });
}

async function replaceImage(id, dataUrl, { skipFullRebuild = false } = {}) {
  const state = await buildSections();
  const section = state.sections.find((item) => item.id === id);
  if (!section?.imageName) {
    throw new Error(`セクション ${id} の画像名がありません。`);
  }
  await snapshotSection(id, "before-image-replace", ["image"]);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "lp-editor-upload-"));
  try {
    const inputPath = path.join(tempDir, "input-image");
    const preparedPath = path.join(tempDir, section.imageName);
    await fs.writeFile(inputPath, bufferFromDataUrl(dataUrl));
    await convertToPngWidth(inputPath, preparedPath, 1080);
    await applyPreparedImage(section, preparedPath, { skipFullRebuild });
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
  return buildSections();
}

async function buildFullImageFile(outputPath, overrides = new Map()) {
  const state = await buildSections();
  const imageEntries = state.sections.flatMap((section) => {
    if (section.id === TESTIMONIAL_SECTION_ID && Array.isArray(section.testimonialSlides) && section.testimonialSlides[0]) {
      const defaultSlide = section.testimonialSlides[0];
      return [
        ["story", defaultSlide.storyImageName],
        ["voice", defaultSlide.voiceImageName]
      ]
        .filter(([, imageName]) => imageName)
        .map(([kind, imageName]) => ({
          section: {
            ...section,
            id: `${section.id}-${kind}`,
            imageName
          },
          path: path.resolve(path.join(IMAGE_DIR, imageName))
        }));
    }
    return [{
      section,
      path: path.resolve(path.join(IMAGE_DIR, section.imageName))
    }];
  });
  const missing = imageEntries.filter((entry) => !entry.section.imageName);
  if (missing.length) {
    throw new Error(`画像名がないセクションがあります: ${missing.map((entry) => entry.section.id).join(", ")}`);
  }

  const missingFiles = [];
  const rendered = [];
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "lp-editor-rebuild-"));
  try {
    for (const entry of imageEntries) {
      const source = overrides.get(entry.path) ?? entry.path;
      if (!(await pathExists(source))) {
        missingFiles.push(`${entry.section.id}: ${relativeFromRepo(source)}`);
        continue;
      }
      const resized = path.join(tempDir, `${rendered.length}.png`);
      await convertToPngWidth(source, resized, 1080);
      const png = PNG.sync.read(await fs.readFile(resized));
      if (png.width !== 1080) {
        throw new Error(`${entry.section.id} の画像幅が1080pxになっていません。`);
      }
      rendered.push(png);
    }

    if (missingFiles.length) {
      throw new Error(`再結合に必要な画像が見つかりません: ${missingFiles.join(" / ")}`);
    }

    if (rendered.length !== imageEntries.length) {
      throw new Error(`画像枚数が一致しません。期待: ${imageEntries.length}枚 / 実際: ${rendered.length}枚`);
    }

    let top = 0;
    for (const png of rendered) {
      top += png.height;
    }

    const output = new PNG({ width: 1080, height: top });
    output.data.fill(255);
    let offset = 0;
    for (const png of rendered) {
      PNG.bitblt(png, output, 0, 0, png.width, png.height, 0, offset);
      offset += png.height;
    }
    await fs.writeFile(outputPath, PNG.sync.write(output, { colorType: 2 }));

    return {
      fullImagePath: relativeFromRepo(outputPath),
      height: top,
      sectionCount: rendered.length
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function applyPreparedImage(section, preparedImagePath, { skipFullRebuild = false } = {}) {
  const targetPath = path.join(IMAGE_DIR, section.imageName);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "lp-editor-commit-"));
  const targetBackup = path.join(tempDir, section.imageName);
  const targetExists = await pathExists(targetPath);

  if (skipFullRebuild) {
    // 一括生成用：セクション画像のみ置換。LP全体再結合は呼び出し元が行う。
    try {
      if (targetExists) await fs.copyFile(targetPath, targetBackup);
      await fs.copyFile(preparedImagePath, targetPath);
    } catch (error) {
      if (targetExists && await pathExists(targetBackup)) {
        await fs.copyFile(targetBackup, targetPath);
      }
      throw error;
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
    return;
  }

  const fullImageTemp = path.join(tempDir, "lp-full.png");
  const fullBackup = path.join(tempDir, "lp-full-backup.png");
  const fullExists = await pathExists(FULL_IMAGE_PATH);

  try {
    await buildFullImageFile(fullImageTemp, new Map([[path.resolve(targetPath), preparedImagePath]]));
    if (targetExists) await fs.copyFile(targetPath, targetBackup);
    if (fullExists) await fs.copyFile(FULL_IMAGE_PATH, fullBackup);

    await fs.copyFile(preparedImagePath, targetPath);
    await fs.copyFile(fullImageTemp, FULL_IMAGE_PATH);
  } catch (error) {
    if (targetExists && await pathExists(targetBackup)) {
      await fs.copyFile(targetBackup, targetPath);
    }
    if (fullExists && await pathExists(fullBackup)) {
      await fs.copyFile(fullBackup, FULL_IMAGE_PATH);
    }
    throw error;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function rebuildFullImage() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "lp-editor-full-"));
  const tempOutput = path.join(tempDir, "lp-full.png");
  try {
    const result = await buildFullImageFile(tempOutput);
    await fs.copyFile(tempOutput, FULL_IMAGE_PATH);
    return {
      ...result,
      fullImagePath: relativeFromRepo(FULL_IMAGE_PATH)
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

function promptWithComposition(prompt, composition) {
  if (!composition) return prompt;
  const base = safeText(prompt).replace(/\n*────────────────\n【構図お気に入り参照】[\s\S]*?【構図お気に入り参照ここまで】\n*/g, "\n\n").trim();
  const block = [
    "────────────────",
    "【構図お気に入り参照】",
    `選択構図: ${composition.title}`,
    `構図ID: ${composition.id}`,
    "",
    "添付された白黒ワイヤーフレーム画像は、配色・画風・コピー内容ではなく構図だけを参照する。",
    "見出し、本文、CTA、商品/人物/背景要素の相対配置、余白、視線誘導、情報ブロックの並びをこのワイヤーフレームに合わせる。",
    "既存LPコピーとこのプロンプトの画風ルールを優先し、ワイヤーフレーム内の仮文字や仮アイコンはそのまま再現しない。",
    "【構図お気に入り参照ここまで】"
  ].join("\n");
  return `${base}\n\n${block}`;
}

function promptWithGlobalRules(prompt, rules) {
  const cleanRules = safeText(rules).trim();
  if (!cleanRules) return prompt;
  const base = safeText(prompt)
    .replace(/\n*────────────────\n【LP全体デザインゲート】[\s\S]*?【LP全体デザインゲートここまで】\n*/g, "\n\n")
    .trim();
  const block = [
    "────────────────",
    "【LP全体デザインゲート】",
    cleanRules,
    "【LP全体デザインゲートここまで】"
  ].join("\n");
  return `${base}\n\n${block}`;
}

async function generateImage(id, refImageNames = [], { signal, compositionId = "", promptOverride = "" } = {}) {
  const state = await buildSections();
  const section = state.sections.find((item) => item.id === id);
  if (!section) {
    throw new Error(`セクション ${id} が見つかりません。`);
  }

  await fs.mkdir(GENERATED_PROMPT_ROOT, { recursive: true });
  const promptFile = path.join(GENERATED_PROMPT_ROOT, `${id}.txt`);
  const outputFile = path.join(GENERATED_PROMPT_ROOT, `${id}-output.png`);
  const composition = compositionId ? await getComposition(compositionId) : null;
  const globalRules = await getGlobalPromptRules();
  const finalPrompt = promptWithGlobalRules(promptWithComposition(promptOverride || section.prompt, composition), globalRules);
  await fs.writeFile(promptFile, finalPrompt, "utf8");

  const effectiveRefImageNames = refImageNames.length ? refImageNames : extractRefImageNames(finalPrompt);
  const refImages = [];
  for (const name of effectiveRefImageNames) {
    const buffer = await getRefImageBuffer(name);
    if (buffer) refImages.push({ name, buffer });
  }
  if (composition?.id) {
    const buffer = await getCompositionBuffer(composition.id);
    if (buffer) refImages.push({ name: `composition-${composition.title}`, buffer });
  }

  const generated = await generateImageWithCodexAppServer({
    prompt: finalPrompt,
    sectionId: id,
    imageName: section.imageName,
    refImages,
    cwd: REPO_ROOT,
    signal,
  });
  if (!generated.configured) {
    return {
      configured: false,
      promptFile: relativeFromRepo(promptFile),
      message: generated.message
    };
  }

  await fs.writeFile(outputFile, generated.buffer);
  const imageDataUrl = `data:image/png;base64,${generated.buffer.toString("base64")}`;
  await replaceImage(id, imageDataUrl);
  return {
    configured: true,
    outputFile: relativeFromRepo(outputFile),
    model: generated.model,
    state: await buildSections()
  };
}

async function regeneratePrompt(id, instruction = "", refImageNames = [], { signal, compositionId = "" } = {}) {
  const state = await buildSections();
  const section = state.sections.find((item) => item.id === id);
  if (!section) throw new Error(`セクション ${id} が見つかりません。`);

  const images = [];
  for (const name of refImageNames) {
    const buffer = await getRefImageBuffer(name);
    if (buffer) images.push({ name, buffer });
  }
  const composition = compositionId ? await getComposition(compositionId) : null;
  if (composition?.id) {
    const buffer = await getCompositionBuffer(composition.id);
    if (buffer) images.push({ name: `composition-${composition.title}`, buffer });
  }

  const compositionInstruction = composition
    ? [
        instruction,
        "",
        `Use the attached black-and-white wireframe named "${composition.title}" only as a composition reference.`,
        "Keep the same relative placement, visual hierarchy, whitespace balance, and CTA/content block arrangement.",
        "Do not copy placeholder text, icons, or monochrome styling from the wireframe."
      ].join("\n").trim()
    : instruction;
  const globalRules = await getGlobalPromptRules();
  const gatedInstruction = [
    globalRules ? `LP全体デザインゲートとして、必ず以下を反映する:\n${globalRules}` : "",
    compositionInstruction
  ].filter(Boolean).join("\n\n");
  const userPrompt = buildPromptRegenerationInstruction(section.copy, section.title, gatedInstruction, section.prompt);
  const result = await generateTextWithCodexAppServer({ userPrompt, images, cwd: REPO_ROOT, signal });
  const newPrompt = result.text.trim();
  if (!newPrompt) throw new Error("プロンプトを生成できませんでした。");

  return { newPrompt };
}

async function regenerateCopy(id, instruction = "", { signal } = {}) {
  const state = await buildSections();
  const section = state.sections.find((item) => item.id === id);
  if (!section) throw new Error(`セクション ${id} が見つかりません。`);

  const userPrompt = buildCopyRegenerationInstruction(section, instruction);
  const result = await generateTextWithCodexAppServer({ userPrompt, cwd: REPO_ROOT, signal });
  const newCopy = result.text.trim();
  if (!newCopy) throw new Error("LP原稿を生成できませんでした。");

  return { newCopy };
}

function parseDelimitedPrompts(rawText, expectedIds) {
  const prompts = new Map();
  const regex = /<<<(SEC-\d{2}[a-z]?)>>>\s*([\s\S]*?)\s*<<<END\s+\1>>>/gi;
  for (const match of rawText.matchAll(regex)) {
    const id = normalizeId(match[1]);
    if (!expectedIds.includes(id)) continue;
    const prompt = match[2].trim();
    if (prompt) prompts.set(id, prompt);
  }
  return prompts;
}

function parseDelimitedCopies(rawText, expectedIds) {
  const copies = new Map();
  const regex = /<<<(SEC-\d{2}[a-z]?)>>>\s*([\s\S]*?)\s*<<<END\s+\1>>>/gi;
  for (const match of rawText.matchAll(regex)) {
    const id = normalizeId(match[1]);
    if (!expectedIds.includes(id)) continue;
    const copy = match[2].trim();
    if (copy) copies.set(id, copy);
  }
  return copies;
}

async function getGlobalPromptRules() {
  try {
    return await fs.readFile(GLOBAL_PROMPT_RULES_PATH, "utf8");
  } catch {
    return "";
  }
}

async function saveGlobalPromptRules(rules = "") {
  await fs.mkdir(path.dirname(GLOBAL_PROMPT_RULES_PATH), { recursive: true });
  const text = safeText(rules).trim();
  await fs.writeFile(GLOBAL_PROMPT_RULES_PATH, text ? `${text}\n` : "", "utf8");
  return { rules: text };
}

async function regeneratePromptsBulk(sectionIds = [], globalInstruction = "", options = {}, abortOptions = {}) {
  const signal = abortOptions.signal ?? options.signal;
  const state = await buildSections();
  const orderedIds = sectionIds.length ? sectionIds.map(normalizeId) : state.sections.map((section) => section.id);
  const uniqueIds = [...new Set(orderedIds)];
  const sections = uniqueIds
    .map((id) => state.sections.find((section) => section.id === id))
    .filter(Boolean);

  if (!sections.length) {
    throw new Error("一括再生成するセクションがありません。");
  }

  const images = [];
  const refImageNames = Array.isArray(options.refImageNames) ? options.refImageNames : [];
  for (const name of refImageNames) {
    const buffer = await getRefImageBuffer(name);
    if (buffer) images.push({ name, buffer });
  }

  // 各セクションに対して並列でプロンプト再生成を実行
  const jobs = sections.map(async (section) => {
    const existingPrompt = options.includeExistingPrompts === false ? "" : section.prompt;
    const userPrompt = buildPromptRegenerationInstruction(section.copy, section.title, globalInstruction, existingPrompt);
    const result = await generateTextWithCodexAppServer({ userPrompt, images, cwd: REPO_ROOT, signal });
    const newPrompt = result.text.trim();
    if (!newPrompt) throw new Error(`${section.id}: プロンプトを生成できませんでした。`);
    return { id: section.id, title: section.title, prompt: newPrompt };
  });

  const outcomes = await Promise.allSettled(jobs);

  const prompts = [];
  const missingIds = [];
  for (const outcome of outcomes) {
    if (outcome.status === "fulfilled") {
      prompts.push(outcome.value);
    } else {
      // エラー時は section.id を reason から抽出するか、元のセクション一覧から補完
      const failed = sections[outcomes.indexOf(outcome)];
      if (failed) missingIds.push(failed.id);
    }
  }

  if (!prompts.length) {
    throw new Error("一括プロンプト再生成の結果を読み取れませんでした。");
  }

  return {
    prompts,
    missingIds,
    totalRequested: sections.length
  };
}

async function regenerateCopyBulk(sectionIds = [], globalInstruction = "", options = {}) {
  const signal = options.signal;
  const state = await buildSections();
  const orderedIds = sectionIds.length ? sectionIds.map(normalizeId) : state.sections.map((section) => section.id);
  const uniqueIds = [...new Set(orderedIds)];
  const sections = uniqueIds
    .map((id) => state.sections.find((section) => section.id === id))
    .filter(Boolean);

  if (!sections.length) {
    throw new Error("一括再生成するセクションがありません。");
  }

  // 各セクションに対して並列で原稿再生成を実行
  const jobs = sections.map(async (section) => {
    const userPrompt = buildCopyRegenerationInstruction(section, globalInstruction);
    const result = await generateTextWithCodexAppServer({ userPrompt, cwd: REPO_ROOT, signal });
    const newCopy = result.text.trim();
    if (!newCopy) throw new Error(`${section.id}: LP原稿を生成できませんでした。`);
    return { id: section.id, title: section.title, copy: newCopy };
  });

  const outcomes = await Promise.allSettled(jobs);

  const copies = [];
  const missingIds = [];
  for (const outcome of outcomes) {
    if (outcome.status === "fulfilled") {
      copies.push(outcome.value);
    } else {
      const failed = sections[outcomes.indexOf(outcome)];
      if (failed) missingIds.push(failed.id);
    }
  }

  if (!copies.length) {
    throw new Error("一括LP原稿再生成の結果を読み取れませんでした。");
  }

  return {
    copies,
    missingIds,
    totalRequested: sections.length
  };
}

async function batchGenerateImages(sectionIds, draftCopies = {}, { signal } = {}) {
  // Phase 1: 逐次 — コピー変更・プロンプト再生成を保存（共有ファイルへの書込のため並列不可）
  const prepMap = new Map(); // id → { copyChanged, error? }
  for (const id of sectionIds) {
    try {
      const currentState = await buildSections();
      const section = currentState.sections.find((s) => s.id === id);
      if (!section) {
        prepMap.set(id, { error: `セクション ${id} が見つかりません。` });
        continue;
      }
      const draftCopy = draftCopies[id];
      const copyChanged = draftCopy !== undefined && draftCopy !== section.copy;
      if (copyChanged) {
        await saveSection(id, { copy: draftCopy });
        const promptResult = await regeneratePrompt(id, "", [], { signal });
        if (promptResult.newPrompt) await saveSection(id, { prompt: promptResult.newPrompt });
      }
      prepMap.set(id, { copyChanged });
    } catch (err) {
      prepMap.set(id, { error: err.message });
    }
  }

  const validIds = sectionIds.filter((id) => !prepMap.get(id)?.error);

  // Phase 2: 並列 — 全セクションの Codex 画像生成を同時に起動
  const state = await buildSections();
  await fs.mkdir(GENERATED_PROMPT_ROOT, { recursive: true });

  const genJobs = validIds.map(async (id) => {
    const section = state.sections.find((s) => s.id === id);
    if (!section) return { id, success: false, error: `セクション ${id} が見つかりません。` };

    const promptFile = path.join(GENERATED_PROMPT_ROOT, `${id}.txt`);
    const outputFile = path.join(GENERATED_PROMPT_ROOT, `${id}-output.png`);
    const globalRules = await getGlobalPromptRules();
    const finalPrompt = promptWithGlobalRules(section.prompt, globalRules);
    await fs.writeFile(promptFile, finalPrompt, "utf8");

    const refImages = [];
    for (const name of extractRefImageNames(finalPrompt)) {
      const buffer = await getRefImageBuffer(name);
      if (buffer) refImages.push({ name, buffer });
    }

    const generated = await generateImageWithCodexAppServer({
      prompt: finalPrompt,
      sectionId: id,
      imageName: section.imageName,
      refImages,
      cwd: REPO_ROOT,
      signal
    });

    if (!generated.configured) {
      return { id, success: false, error: generated.message ?? "Codex未設定" };
    }

    await fs.writeFile(outputFile, generated.buffer);
    return { id, success: true, buffer: generated.buffer, model: generated.model };
  });

  const genOutcomes = await Promise.allSettled(genJobs);

  // Phase 3: 逐次 — セクション画像を書込（lp-full.png の競合を避けるため順番に処理）
  const successItems = [];
  const results = [];

  for (const outcome of genOutcomes) {
    const data = outcome.status === "fulfilled"
      ? outcome.value
      : { id: "?", success: false, error: String(outcome.reason) };
    const prep = prepMap.get(data.id) ?? {};

    if (!data.success) {
      results.push({ id: data.id, success: false, copyRegenerated: prep.copyChanged ?? false, error: data.error });
      continue;
    }
    successItems.push(data);
  }

  for (const data of successItems) {
    const prep = prepMap.get(data.id) ?? {};
    try {
      const imageDataUrl = `data:image/png;base64,${data.buffer.toString("base64")}`;
      await replaceImage(data.id, imageDataUrl, { skipFullRebuild: true });
      results.push({ id: data.id, success: true, copyRegenerated: prep.copyChanged ?? false, model: data.model });
    } catch (err) {
      results.push({ id: data.id, success: false, copyRegenerated: prep.copyChanged ?? false, error: err.message });
    }
  }

  // Phase 4: LP全体再結合を1回だけ実行
  if (successItems.length > 0) {
    await rebuildFullImage();
  }

  // Phase 1 でエラーになったセクションも results に追加
  for (const id of sectionIds) {
    const prep = prepMap.get(id);
    if (prep?.error && !results.some((r) => r.id === id)) {
      results.push({ id, success: false, copyRegenerated: false, error: prep.error });
    }
  }

  // 入力と同じ順序で返す
  return sectionIds.map((id) => results.find((r) => r.id === id) ?? { id, success: false, error: "不明なエラー" });
}

async function getGitStatus() {
  try {
    const { stdout } = await execFileAsync("git", ["status", "--short", "--branch"], {
      cwd: REPO_ROOT,
      timeout: 1000 * 10
    });
    return filterEditorHistoryFromGitStatus(stdout).trim();
  } catch (error) {
    return error.message;
  }
}

async function getGitPorcelain() {
  const { stdout } = await execFileAsync("git", ["status", "--porcelain"], {
    cwd: REPO_ROOT,
    timeout: 1000 * 10
  });
  return filterEditorHistoryFromGitStatus(stdout).trim();
}

function filterEditorHistoryFromGitStatus(status) {
  return String(status || "")
    .split(/\r?\n/)
    .filter((line) => !/^\?\?\s+\.lp-editor\//.test(line) && !/^..?\s+\.lp-editor\//.test(line))
    .join("\n");
}

async function deployToVercel({ allowDirty = false } = {}) {
  const dirtyStatus = await getGitPorcelain();
  if (dirtyStatus && !allowDirty) {
    const error = new Error("未コミットの変更があります。内容を確認してから公開してください。");
    error.code = "DIRTY_WORKTREE";
    error.statusCode = 409;
    error.gitStatus = dirtyStatus;
    throw error;
  }

  const command = process.env.LP_VERCEL_COMMAND || "npx vercel --prod --yes";
  const { stdout, stderr } = await execAsync(command, {
    cwd: LP_DIR,
    timeout: 1000 * 60 * 15,
    maxBuffer: 1024 * 1024 * 20,
    env: process.env
  });

  return {
    command,
    cwd: relativeFromRepo(LP_DIR),
    dirtyStatus,
    output: `${stdout}${stderr}`.trim()
  };
}

export const lpStore = {
  REPO_ROOT,
  LP_DIR,
  buildSections,
  saveSection,
  addSection,
  deleteSection,
  applySectionStructure,
  getOperationHistory,
  undoOperation: () => restoreOperation("undo"),
  redoOperation: () => restoreOperation("redo"),
  restoreSection,
  replaceImage,
  rebuildFullImage,
  generateImage,
  regenerateCopy,
  regenerateCopyBulk,
  regeneratePrompt,
  regeneratePromptsBulk,
  getGlobalPromptRules,
  saveGlobalPromptRules,
  batchGenerateImages,
  getCodexImageServerStatus,
  getGitStatus,
  deployToVercel,
  listSnapshots,
  restoreSnapshot,
  listStateSnapshots,
  createStateSnapshot,
  restoreStateSnapshot,
  deleteStateSnapshot
};
