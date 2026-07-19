import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/emberwood-glamping-swipe-lp");
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
  { id: "03-stay-forest-dome", imageName: "03-stay-forest-dome.png" },
  { id: "04-stay-riverside-cabin", imageName: "04-stay-riverside-cabin.png" },
  { id: "05-stay-terrace-suite", imageName: "05-stay-terrace-suite.png" },
  { id: "06-activities-firepit-dining", imageName: "06-activities-firepit-dining.png" },
  { id: "07-activities-stargazing", imageName: "07-activities-stargazing.png" },
  { id: "08-dining-world", imageName: "08-dining-world.png" },
  { id: "10-access", imageName: "10-access.png" },
  { id: "11-final-cta", imageName: "11-final-cta.png" },
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
