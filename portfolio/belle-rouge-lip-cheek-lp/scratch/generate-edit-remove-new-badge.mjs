import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "portfolio/belle-rouge-lip-cheek-lp");
const OUT_DIR = path.join(PROJECT_DIR, "scratch");

const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

async function main() {
  const prompt = await fs.readFile(path.join(OUT_DIR, "prompt-edit-remove-new-badge.md"), "utf-8");
  await fs.mkdir(OUT_DIR, { recursive: true });

  const refImages = [
    { path: path.join(PROJECT_DIR, "lp/images/01-hero.png"), name: "current-hero.png" },
  ];

  console.log("Generating hero image with NEW badge removed...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "belle-rouge-hero-remove-badge",
    imageName: "01-hero-no-badge.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  if (!result.configured) {
    throw new Error(result.message || "Codex app-server image generation is not configured.");
  }

  const outPath = path.join(OUT_DIR, "01-hero-no-badge.png");
  await fs.writeFile(outPath, result.buffer);
  console.log(`Saved: ${outPath}`);
  if (result.revisedPrompt) {
    console.log(`Revised prompt: ${result.revisedPrompt}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
