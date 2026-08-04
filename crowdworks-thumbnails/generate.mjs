import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const BASE = path.join(REPO_ROOT, "crowdworks-thumbnails");
const LANCERS_UPLOAD = path.join(REPO_ROOT, "lancers-thumbnails/for-upload");

const TARGETS = {
  "lp-diagnosis": "01_LP診断.png",
  "swipe-lp": "02_スワイプ型LP制作.png",
  "lp-general": "03_LP作成.png",
  "banner": "04_バナー制作.png",
  "moving-lp": "06_動くLP制作.png",
};

async function run(name) {
  const refName = TARGETS[name];
  if (!refName) throw new Error(`unknown target: ${name}`);

  const dir = path.join(BASE, name);
  const prompt = await fs.readFile(path.join(dir, "prompt.md"), "utf-8");
  const outDir = path.join(dir, "output");
  await fs.mkdir(outDir, { recursive: true });

  const refImages = [
    { path: path.join(LANCERS_UPLOAD, refName), name: "img1" },
  ];

  console.log(`[${name}] generating with ref ${refName} ...`);
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `crowdworks-thumbnail-${name}`,
    imageName: "thumbnail.png",
    refImages,
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(outDir, "thumbnail.png");
  await fs.writeFile(outPath, result.buffer);
  console.log(`[${name}] saved: ${outPath}`);
  if (result.revisedPrompt) {
    console.log(`[${name}] revised prompt: ${result.revisedPrompt}`);
  }
}

const target = process.argv[2];
if (!target) {
  console.error("usage: node generate.mjs <target|all>");
  process.exit(1);
}

async function main() {
  if (target === "all") {
    for (const name of Object.keys(TARGETS)) {
      await run(name);
    }
  } else {
    await run(target);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
