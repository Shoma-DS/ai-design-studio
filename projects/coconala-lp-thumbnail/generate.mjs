import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "projects/coconala-lp-thumbnail");
const OUT_DIR = path.join(PROJECT_DIR, "output");

async function main() {
  const prompt = await fs.readFile(path.join(PROJECT_DIR, "prompt.md"), "utf-8");
  await fs.mkdir(OUT_DIR, { recursive: true });

  const refImages = [
    { path: path.join(PROJECT_DIR, "references/ref-01.jpg"), name: "ref-01.jpg" },
    { path: path.join(PROJECT_DIR, "references/ref-02.jpg"), name: "ref-02.jpg" },
    { path: path.join(PROJECT_DIR, "references/ref-03.jpg"), name: "ref-03.jpg" },
  ];

  console.log("Generating coconala LP thumbnail...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "coconala-lp-thumbnail",
    imageName: "thumbnail.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(OUT_DIR, "thumbnail.png");
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
