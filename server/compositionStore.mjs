import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "./codexImageClient.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
export const COMPOSITION_ROOT = path.join(REPO_ROOT, ".lp-editor", "compositions");
const IMAGE_DIR = path.join(COMPOSITION_ROOT, "images");
const INDEX_PATH = path.join(COMPOSITION_ROOT, "index.json");
const SELECTED_PATH = path.join(COMPOSITION_ROOT, "selected.json");

const safeText = (value) => (typeof value === "string" ? value : "");

export const COMPOSITION_WIREFRAME_PROMPT = `あなたは、広告バナー・LPデザイン・SNSクリエイティブの構成を読み解くプロのUI/UXワイヤーフレームデザイナーです。

添付画像を参考に、完成されたカラー広告デザインを「白黒のワイヤーフレーム設計図」に変換してください。

目的は、元画像の雰囲気や配色を再現することではなく、
「どこに何を配置すれば同じ構成になるか」が一目でわかる設計図にすることです。
完成デザインをそのまま再現せず、デザイナーが後から同じ構成で作り直せるように、
情報設計・配置・要素サイズ・余白・視線誘導だけを抽出してください。

【変換ルール】
・カラーはすべて排除し、白背景＋黒/グレーの線画のみで表現する
・写真、人物、商品、背景画像はリアルに描かず、シンプルな線画・枠・プレースホルダーに置き換える
・元画像のレイアウト、余白、要素の大きさ、配置バランスはできる限り維持する
・文字は実際のコピーを再現せず、役割がわかる仮テキストに置き換える
・デザインの完成版ではなく、制作前のラフ設計図・構成図として見えるようにする
・過度な装飾、影、グラデーション、色付きアイコンは禁止
・細い線、薄いグレーの補助線、角丸の枠で整理された見た目にする
・全体は清潔感のあるミニマルな日本語ワイヤーフレームにする
・情報の階層がわかるように、見出し・本文・注記・CTAの文字サイズに差をつける
・文字ラベルは小さくしすぎず、構成図として判読できるサイズにする
・日本語広告バナー／LPセクションの構成図として見やすく整理する

【文字の置き換え例】
・ブランドロゴ → 「ロゴ」
・メインコピー → 「見出し（大）」
・サブコピー → 「サブコピー」
・商品名 → 「商品名」
・説明文 → 「本文テキスト」
・価格 → 「価格（大）」
・割引や限定訴求 → 「バッジ／キャンペーン情報」
・ボタン → 「CTAボタン」
・特徴説明 → 「特徴ポイント1」「特徴ポイント2」「特徴ポイント3」
・写真や商品画像 → 「商品画像」「背景画像」「人物画像」「UIイメージ」
・アイコン → シンプルな線画アイコン

【出力イメージ】
・モノクロの広告ワイヤーフレーム
・紙に描いたラフではなく、デザイナーが作る清潔な設計図
・Figmaの低忠実度ワイヤーフレームのような見た目
・各要素の役割が日本語ラベルでわかる
・元画像と同じ縦横比、同じ構図を維持する

【重要】
元画像の色・質感・写真美しさに引っ張られず、
「構成」「情報設計」「視線誘導」「配置ルール」だけを抽出してください。
カラー、リアルな質感、光沢、影、グラデーション、作り込まれた完成デザイン風の装飾は絶対に入れないでください。

high quality monochrome wireframe, low fidelity UI design, clean Japanese layout, grayscale only, thin outline, white background, no color, no realistic rendering, no shadows, no gradients`;

function safeKey(value, fallback = "default") {
  return safeText(value)
    .trim()
    .replace(/[^0-9a-zA-Z._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallback;
}

function normalizeSectionId(value) {
  const raw = safeText(value).trim();
  const match = raw.match(/^SEC[-\s]?(\d{1,2})([a-z])?/i);
  if (!match) return safeKey(raw, "");
  return `SEC-${match[1].padStart(2, "0")}${match[2] ? match[2].toLowerCase() : ""}`;
}

function selectedKey(styleKey, sectionId) {
  return `${safeKey(styleKey)}::${normalizeSectionId(sectionId)}`;
}

function bufferFromDataUrl(dataUrl) {
  const match = safeText(dataUrl).match(/^data:image\/(?:png|jpeg|jpg|webp);base64,([\s\S]+)$/i);
  if (!match) throw new Error("構図画像データを読み取れませんでした。");
  return Buffer.from(match[1], "base64");
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function buildCompositionWireframePrompt({ sectionId, title, sourceImageName }) {
  return [
    COMPOSITION_WIREFRAME_PROMPT,
    "",
    "【対象】",
    `セクションID: ${sectionId || "未指定"}`,
    `構図名: ${title || "未指定"}`,
    `元画像: ${sourceImageName || "現在のセクション画像"}`,
    "",
    "添付された元画像の構図だけを抽出し、保存用の白黒ワイヤーフレーム画像を1枚生成してください。"
  ].join("\n");
}

async function generateWireframeFromImage(sourceImagePath, payload, signal) {
  const sourcePath = path.resolve(sourceImagePath || "");
  if (!sourceImagePath || !(await pathExists(sourcePath))) {
    throw new Error("構図化する元画像が見つかりません。");
  }

  return generateImageWithCodexAppServer({
    prompt: buildCompositionWireframePrompt(payload),
    sectionId: `COMPOSITION-${payload.sectionId || "unknown"}`,
    imageName: `${safeKey(payload.title, payload.sectionId || "composition")}-wireframe.png`,
    refImages: [{ name: payload.sourceImageName || "source-design", path: sourcePath }],
    cwd: REPO_ROOT,
    signal,
    taskType: "wireframe"
  });
}

async function assertGeneratedWireframeIsNotSource(generatedBuffer, sourceImagePath) {
  if (!sourceImagePath || !Buffer.isBuffer(generatedBuffer)) return;
  try {
    const sourceBuffer = await fs.readFile(path.resolve(sourceImagePath));
    const generatedHash = crypto.createHash("sha256").update(generatedBuffer).digest("hex");
    const sourceHash = crypto.createHash("sha256").update(sourceBuffer).digest("hex");
    if (generatedHash === sourceHash) {
      throw new Error("構図ワイヤーフレーム生成結果が元画像と同一でした。生成結果の抽出に失敗した可能性があるため、保存を中止しました。");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("元画像と同一")) throw error;
  }
}

async function readJson(target, fallback) {
  try {
    return JSON.parse(await fs.readFile(target, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(target, value) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readIndex() {
  const items = await readJson(INDEX_PATH, []);
  return Array.isArray(items) ? items.filter((item) => item?.id) : [];
}

function publicItem(item) {
  return {
    ...item,
    url: `/composition-assets/images/${encodeURIComponent(item.fileName)}?v=${encodeURIComponent(item.updatedAt || item.createdAt || "")}`
  };
}

export async function listCompositions(styleKey, sectionId) {
  const style = safeKey(styleKey);
  const section = normalizeSectionId(sectionId);
  const items = await readIndex();
  return items
    .filter((item) => item.styleKey === style && item.sectionId === section)
    .sort((a, b) => safeText(b.createdAt).localeCompare(safeText(a.createdAt)))
    .map(publicItem);
}

export async function saveComposition(payload = {}, options = {}) {
  const styleKey = safeKey(payload.styleKey);
  const sectionId = normalizeSectionId(payload.sectionId);
  if (!sectionId) throw new Error("セクションIDが正しくありません。");

  const now = new Date().toISOString();
  const id = `${styleKey}-${sectionId}-${now.replace(/[:.]/g, "-")}-${crypto.randomUUID().slice(0, 8)}`;
  const fileName = `${id}.png`;
  const generated = payload.dataUrl
    ? { buffer: bufferFromDataUrl(payload.dataUrl), model: "", transport: "" }
    : await generateWireframeFromImage(options.sourceImagePath, {
        sectionId,
        title: safeText(payload.title).trim() || `${sectionId} 構図`,
        sourceImageName: safeText(payload.sourceImageName).trim()
      }, options.signal);
  if (!payload.dataUrl) {
    await assertGeneratedWireframeIsNotSource(generated.buffer, options.sourceImagePath);
  }

  await fs.mkdir(IMAGE_DIR, { recursive: true });
  await fs.writeFile(path.join(IMAGE_DIR, fileName), generated.buffer);

  const item = {
    id,
    styleKey,
    sectionId,
    title: safeText(payload.title).trim() || `${sectionId} 構図`,
    note: safeText(payload.note).trim(),
    sourceImageName: safeText(payload.sourceImageName).trim(),
    source: payload.dataUrl ? "upload" : "codex-wireframe",
    model: generated.model || "",
    transport: generated.transport || "",
    fileName,
    createdAt: now,
    updatedAt: now
  };

  const index = await readIndex();
  await writeJson(INDEX_PATH, [item, ...index]);
  return publicItem(item);
}

export async function deleteComposition(id) {
  const safeId = safeKey(id, "");
  if (!safeId) throw new Error("構図IDが正しくありません。");

  const index = await readIndex();
  const target = index.find((item) => item.id === safeId);
  if (!target) return;

  await fs.rm(path.join(IMAGE_DIR, target.fileName), { force: true });
  await writeJson(INDEX_PATH, index.filter((item) => item.id !== safeId));

  const selected = await readJson(SELECTED_PATH, {});
  for (const [key, value] of Object.entries(selected)) {
    if (value === safeId) delete selected[key];
  }
  await writeJson(SELECTED_PATH, selected);
}

export async function getComposition(id) {
  const safeId = safeKey(id, "");
  if (!safeId) return null;
  const item = (await readIndex()).find((entry) => entry.id === safeId);
  return item ? publicItem(item) : null;
}

export async function getCompositionBuffer(id) {
  const item = await getComposition(id);
  if (!item) return null;
  try {
    return await fs.readFile(path.join(IMAGE_DIR, item.fileName));
  } catch {
    return null;
  }
}

export async function getSelectedCompositions(styleKey) {
  const style = safeKey(styleKey);
  const selected = await readJson(SELECTED_PATH, {});
  const index = await readIndex();
  const byId = new Map(index.map((item) => [item.id, publicItem(item)]));
  const result = {};

  for (const [key, id] of Object.entries(selected)) {
    if (!key.startsWith(`${style}::`)) continue;
    const sectionId = key.slice(style.length + 2);
    const item = byId.get(id);
    if (item) result[sectionId] = item;
  }

  return result;
}

export async function selectComposition(styleKey, sectionId, compositionId = "") {
  const selected = await readJson(SELECTED_PATH, {});
  const key = selectedKey(styleKey, sectionId);
  const id = safeKey(compositionId, "");

  if (id) {
    const item = await getComposition(id);
    if (!item) throw new Error("選択する構図が見つかりません。");
    selected[key] = id;
  } else {
    delete selected[key];
  }

  await writeJson(SELECTED_PATH, selected);
  return getSelectedCompositions(styleKey);
}
