import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "../..");
const imageDir = path.join(projectRoot, "lp/images/mobile");
const refDir = path.join(projectRoot, "references");

const SIZE_FORCE = "画像生成ツールを呼び出す際、size パラメータには必ず \"1024x1536\" を指定すること。\"1536x1024\" や \"1024x1024\" は指定しないこと。縦長のスマートフォン画面比率で生成する。\n\n";
const SKIP_REF = new Set((process.env.NO_REF_IDS || "").split(",").filter(Boolean));

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

await fs.mkdir(imageDir, { recursive: true });

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  if (await exists(outputPath)) {
    console.log(`skip ${section.id}: already exists`);
    return;
  }
  console.log(`generate mobile ${section.id}: ${section.title}`);
  const prompt = SIZE_FORCE + buildPrompt(section);
  const refImages = [];
  if (!SKIP_REF.has(section.id)) {
    const refPath = path.join(refDir, `${section.id}.png`);
    const refBuffer = await fs.readFile(refPath);
    refImages.push({ name: `${section.id}-reference.png`, buffer: refBuffer });
  }
  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages,
    cwd: repoRoot,
    taskType: "section",
  });
  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done mobile ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

for (const section of selected) {
  await generateOne(section);
}
console.log(`Generated ${selected.length} mobile sections.`);
