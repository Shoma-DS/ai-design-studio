import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "projects/coconala-animated-lp-thumbnail");
const OUT_DIR = path.join(PROJECT_DIR, "output");

async function main() {
  const prompt = await fs.readFile(path.join(PROJECT_DIR, "prompt-edit-fix-lp-navy.md"), "utf-8");
  await fs.mkdir(OUT_DIR, { recursive: true });

  const refImages = [
    { path: path.join(OUT_DIR, "thumbnail-v7-refine-gold.png"), name: "img1.png" },
  ];

  console.log("Editing coconala animated-LP thumbnail: fix LP fill color back to navy...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "coconala-animated-lp-thumbnail",
    imageName: "thumbnail-v8-fix-lp-navy.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(OUT_DIR, "thumbnail-v8-fix-lp-navy.png");
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
