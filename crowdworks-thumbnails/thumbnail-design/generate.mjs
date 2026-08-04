import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const DIR = path.join(REPO_ROOT, "crowdworks-thumbnails/thumbnail-design");

async function run() {
  const prompt = await fs.readFile(path.join(DIR, "prompt.md"), "utf-8");
  const outDir = path.join(DIR, "output");
  await fs.mkdir(outDir, { recursive: true });

  const refImages = [
    {
      path: path.join(
        REPO_ROOT,
        "crowdworks-thumbnails/lp-general/output/thumbnail-v2-dark-glow-checklist.png"
      ),
      name: "ref",
    },
  ];

  console.log("generating thumbnail-design (dark glow + checklist) ...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "crowdworks-thumbnail-thumbnail-design",
    imageName: "thumbnail.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(outDir, "thumbnail.png");
  await fs.writeFile(outPath, result.buffer);
  console.log(`saved: ${outPath}`);
  if (result.revisedPrompt) {
    console.log(`revised prompt: ${result.revisedPrompt}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
