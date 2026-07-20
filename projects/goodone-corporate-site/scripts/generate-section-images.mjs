import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections } from "./sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "projects/goodone-corporate-site");
const imageDir = path.join(projectRoot, "public/images");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
const args = process.argv.slice(2);
const force = args.includes("--force");
const wantedIds = new Set(args.filter((arg) => arg !== "--force"));
const selected = wantedIds.size ? sections.filter((section) => wantedIds.has(section.id)) : sections;
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 2), 4));

if (codexHome) {
  process.env.CODEX_HOME = codexHome;
}

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
  if (!force && (await exists(outputPath))) {
    console.log(`skip ${section.id}: ${path.relative(repoRoot, outputPath)}`);
    return;
  }

  console.log(`generate ${section.id}: ${section.title}`);
  const generated = await generateImageWithCodexAppServer({
    prompt: section.prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }

  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

for (let index = 0; index < selected.length; index += concurrency) {
  await Promise.all(selected.slice(index, index + concurrency).map((section) => generateOne(section)));
}
