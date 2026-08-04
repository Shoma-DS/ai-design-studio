import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const DIR = path.join(REPO_ROOT, "crowdworks-thumbnails/lp-general");

async function run() {
  const prompt = await fs.readFile(
    path.join(DIR, "prompt-v2-dark-glow-checklist.md"),
    "utf-8"
  );
  const outDir = path.join(DIR, "output");
  await fs.mkdir(outDir, { recursive: true });

  const refImages = [
    {
      path: path.join(DIR, "output/thumbnail.png"),
      name: "ref1",
    },
    {
      path: path.join(REPO_ROOT, "crowdworks-thumbnails/moving-lp/output/thumbnail.png"),
      name: "ref2",
    },
    {
      path: path.join(
        REPO_ROOT,
        "projects/coconala-lp-results-thumbnail/output/thumbnail-v5-replace-strip-with-text.png"
      ),
      name: "ref3",
    },
  ];

  console.log("generating lp-general v2 (dark glow + checklist) ...");
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: "crowdworks-thumbnail-lp-general-v2",
    imageName: "thumbnail-v2.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(outDir, "thumbnail-v2-dark-glow-checklist.png");
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
