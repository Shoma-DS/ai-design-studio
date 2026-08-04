// ヒーロー「トレーニング動作」コマ画像の生成
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/generate-hero-motion.mjs [id...] [--force]
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { motionFrames } from "./hero-motion-frames.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/clarive-womens-personal-gym-lp");
const outDir = path.join(projectRoot, "references/motion-frames");
const refPath = path.join(projectRoot, "references/original-png/01-hero.png");

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const wanted = new Set(argv.filter((a) => !a.startsWith("--")));
const targets = wanted.size ? motionFrames.filter((f) => wanted.has(f.id)) : motionFrames;

await fs.mkdir(outDir, { recursive: true });
const refBuffer = await fs.readFile(refPath);

let ok = 0, skipped = 0;
const failed = [];

for (const frame of targets) {
  const outPath = path.join(outDir, frame.file);
  if (!force) {
    try { await fs.access(outPath); console.log(`skip   ${frame.id}`); skipped++; continue; } catch { /* 未生成 */ }
  }
  const started = Date.now();
  console.log(`gen    ${frame.id}`);
  try {
    const result = await generateImageWithCodexAppServer({
      prompt: frame.prompt,
      sectionId: frame.id,
      imageName: frame.file,
      refImages: [{ name: "hero-frame-0-reference.png", buffer: refBuffer }],
      cwd: repoRoot,
      taskType: frame.taskType,
    });
    if (!result.configured) throw new Error(result.message || "Codex app-server is not configured.");
    if (!result.buffer) throw new Error("No image buffer returned.");
    await fs.writeFile(outPath, result.buffer);
    ok++;
    console.log(`done   ${frame.id} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  } catch (err) {
    failed.push({ id: frame.id, message: err?.message || String(err) });
    console.error(`FAIL   ${frame.id}: ${err?.message || err}`);
  }
}

console.log(`\n=== summary: ${ok} generated, ${skipped} skipped, ${failed.length} failed ===`);
for (const f of failed) console.log(`  FAILED ${f.id}: ${f.message}`);
if (failed.length) process.exitCode = 1;
