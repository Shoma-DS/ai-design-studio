import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "projects/coconala-lp-outline-thumbnail");
const OUT_DIR = path.join(PROJECT_DIR, "output");

async function main() {
  const prompt = await fs.readFile(path.join(PROJECT_DIR, "prompt-resize-safe-margin.md"), "utf-8");
  await fs.mkdir(OUT_DIR, { recursive: true });

  const refImages = [
    { path: path.join(PROJECT_DIR, "references/thumbnail-v1.png"), name: "img1.png" },
  ];

  console.log("Generating coconala-lp-outline-thumbnail: add safe margin...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "coconala-lp-outline-thumbnail",
    imageName: "thumbnail-v2-safe-margin.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(OUT_DIR, "thumbnail-v2-safe-margin.png");
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
