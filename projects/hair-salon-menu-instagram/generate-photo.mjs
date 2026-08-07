import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const PROJECT_DIR = path.join(REPO_ROOT, "projects/hair-salon-menu-instagram");
const OUT_DIR = path.join(PROJECT_DIR, "assets");

async function main() {
  const prompt = await fs.readFile(path.join(PROJECT_DIR, "prompt.md"), "utf-8");
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log("Generating salon menu portrait photo...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "salon-menu-portrait",
    imageName: "portrait.png",
    refImages: [],
    cwd: REPO_ROOT,
    taskType: "reference",
  });

  const outPath = path.join(OUT_DIR, "portrait.png");
  await fs.writeFile(outPath, result.buffer);
  console.log(`Saved: ${outPath}`);
  if (result.revisedPrompt) console.log(`Revised prompt: ${result.revisedPrompt}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
