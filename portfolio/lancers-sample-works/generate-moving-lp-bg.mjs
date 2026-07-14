import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "portfolio/lancers-sample-works");
const OUT_DIR = path.join(PROJECT_DIR, "output");

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const prompt = await fs.readFile(path.join(PROJECT_DIR, "prompt-moving-lp-bg.md"), "utf-8");
  console.log("Generating moving-lp-bg.png...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "lancers-sample-moving-lp-bg",
    imageName: "moving-lp-bg.png",
    refImages: [],
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(OUT_DIR, "moving-lp-bg.png");
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
