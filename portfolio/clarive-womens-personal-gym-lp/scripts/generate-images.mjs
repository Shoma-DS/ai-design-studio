// CLARIVE LP 画像生成
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/generate-images.mjs [id...]
// 引数なしで全件。既に存在するファイルはスキップ（--force で強制再生成）。
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { images, imageById } from "./images.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/clarive-womens-personal-gym-lp");
const pcDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(pcDir, "mobile");

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const wanted = new Set(argv.filter((a) => !a.startsWith("--")));
const targets = wanted.size ? images.filter((i) => wanted.has(i.id)) : images;

const outPathOf = (img) => path.join(img.dir === "mobile" ? mobileDir : pcDir, img.file);

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

let ok = 0;
let skipped = 0;
const failed = [];

for (const img of targets) {
  const outPath = outPathOf(img);
  if (!force && (await exists(outPath))) {
    console.log(`skip   ${img.id} (already exists)`);
    skipped += 1;
    continue;
  }

  const refImages = [];
  if (img.refFrom) {
    const refImg = imageById[img.refFrom];
    const refPath = outPathOf(refImg);
    if (await exists(refPath)) {
      refImages.push({ name: `${img.refFrom}-reference.png`, buffer: await fs.readFile(refPath) });
    } else {
      console.log(`warn   ${img.id}: reference ${img.refFrom} not found, generating without it`);
    }
  }

  const started = Date.now();
  console.log(`gen    ${img.id} -> ${path.relative(repoRoot, outPath)}${refImages.length ? " (with ref)" : ""}`);
  try {
    const result = await generateImageWithCodexAppServer({
      prompt: img.prompt,
      sectionId: img.id,
      imageName: img.file,
      refImages,
      cwd: repoRoot,
      taskType: img.taskType || "showcase",
    });
    if (!result.configured) throw new Error(result.message || "Codex app-server is not configured.");
    if (!result.buffer) throw new Error("No image buffer returned.");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, result.buffer);
    ok += 1;
    console.log(`done   ${img.id} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  } catch (err) {
    failed.push({ id: img.id, message: err?.message || String(err) });
    console.error(`FAIL   ${img.id}: ${err?.message || err}`);
  }
}

console.log(`\n=== summary: ${ok} generated, ${skipped} skipped, ${failed.length} failed ===`);
for (const f of failed) console.log(`  FAILED ${f.id}: ${f.message}`);
if (failed.length) process.exitCode = 1;
