import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/keishou-tax-swipe-lp");
const imageDir = path.join(projectRoot, "lp/images");
const promptsDir = path.join(projectRoot, "copy/prompts");

function loadPrompt(id) {
  const text = fs.readFileSync(path.join(promptsDir, `${id}.md`), "utf-8");
  const marker = "## プロンプト";
  const idx = text.indexOf(marker);
  if (idx === -1) throw new Error(`"${marker}" セクションが見つかりません: ${id}.md`);
  return text.slice(idx + marker.length).trim();
}

const sections = [
  { id: "01-hook", imageName: "01-hook.png" },
  { id: "02-stats", imageName: "02-stats.png" },
  { id: "03-checklist", imageName: "03-checklist.png" },
  { id: "04-solution", imageName: "04-solution.png" },
  { id: "05-testimonial-a", imageName: "05-testimonial-a.png" },
  { id: "06-testimonial-b", imageName: "06-testimonial-b.png" },
  { id: "07-rep", imageName: "07-rep.png" },
  { id: "08-final-cta", imageName: "08-final-cta.png" },
].map((section) => ({ ...section, prompt: loadPrompt(section.id) }));

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((section) => wantedIds.has(section.id)) : sections;
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 3), 6));

await fs.promises.mkdir(imageDir, { recursive: true });

async function exists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  if (await exists(outputPath)) {
    console.log(`skip ${section.id}: ${path.relative(repoRoot, outputPath)}`);
    return;
  }

  console.log(`generate ${section.id}`);
  const generated = await generateImageWithCodexAppServer({
    prompt: section.prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [],
    cwd: repoRoot,
    taskType: "showcase",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.promises.writeFile(outputPath, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

let index = 0;
const failures = [];

async function worker() {
  while (index < selected.length) {
    const section = selected[index++];
    try {
      await generateOne(section);
    } catch (error) {
      failures.push({ id: section.id, error });
      console.error(`fail ${section.id}:`, error?.message || error);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, () => worker()));

if (failures.length) {
  console.error(`${failures.length} image generation tasks failed.`);
  process.exitCode = 1;
} else {
  console.log(`Generated ${selected.length} requested images.`);
}
