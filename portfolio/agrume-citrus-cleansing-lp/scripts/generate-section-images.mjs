import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { project, sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/agrume-citrus-cleansing-lp");
const imageDir = path.join(projectRoot, "lp/images");
const refDir = path.join(projectRoot, "references");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME || "/private/tmp/lp-design-codex-home";
const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((section) => wantedIds.has(section.id)) : sections;
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 3), 8));

process.env.CODEX_HOME = codexHome;

await fs.mkdir(codexHome, { recursive: true });
await fs.mkdir(imageDir, { recursive: true });

async function exists(filePath) {
  try {
    await fs.access(filePath);
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

  const refPath = path.join(refDir, `${section.id}.png`);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate ${section.id}: ${section.title}`);
  const generated = await generateImageWithCodexAppServer({
    prompt: buildPrompt(section),
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-reference.png`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outputPath)} (${generated.model || project.title})`);
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
