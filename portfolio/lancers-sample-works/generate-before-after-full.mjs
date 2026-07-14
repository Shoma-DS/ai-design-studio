import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "portfolio/lancers-sample-works");
const OUT_DIR = path.join(PROJECT_DIR, "output");

const targets = [
  { promptFile: "prompt-before-full.md", sectionId: "lancers-sample-before-full", imageName: "before-full.png" },
  { promptFile: "prompt-after-full.md", sectionId: "lancers-sample-after-full", imageName: "after-full.png" },
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const target of targets) {
    const prompt = await fs.readFile(path.join(PROJECT_DIR, target.promptFile), "utf-8");
    console.log(`Generating ${target.imageName}...`);
    const result = await generateImageWithCodexAppServer({
      prompt,
      sectionId: target.sectionId,
      imageName: target.imageName,
      refImages: [],
      cwd: REPO_ROOT,
      taskType: "showcase",
    });

    const outPath = path.join(OUT_DIR, target.imageName);
    await fs.writeFile(outPath, result.buffer);
    console.log(`Saved: ${outPath}`);
    if (result.revisedPrompt) {
      console.log(`Revised prompt: ${result.revisedPrompt}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
