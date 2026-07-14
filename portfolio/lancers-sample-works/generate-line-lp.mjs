import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "portfolio/lancers-sample-works");
const OUT_DIR = path.join(PROJECT_DIR, "output");

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const prompt = await fs.readFile(path.join(PROJECT_DIR, "prompt-line-lp.md"), "utf-8");
  console.log("Generating line-lp.png...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "lancers-sample-line-lp",
    imageName: "line-lp.png",
    refImages: [],
    cwd: REPO_ROOT,
    taskType: "showcase",
  });
  const outPath = path.join(OUT_DIR, "line-lp.png");
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
