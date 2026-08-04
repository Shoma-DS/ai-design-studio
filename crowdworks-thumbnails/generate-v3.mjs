import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const BASE = path.join(REPO_ROOT, "crowdworks-thumbnails");

const TARGETS = {
  "lp-general": {
    promptFile: "prompt-v3-distinct-layout.md",
    outFile: "thumbnail-v3-distinct-layout.png",
  },
  "banner": {
    promptFile: "prompt-v3-distinct-layout.md",
    outFile: "thumbnail-v3-distinct-layout.png",
  },
  "thumbnail-design": {
    promptFile: "prompt-v2-distinct-layout.md",
    outFile: "thumbnail-v2-distinct-layout.png",
  },
};

async function run(name) {
  const cfg = TARGETS[name];
  if (!cfg) throw new Error(`unknown target: ${name}`);

  const dir = path.join(BASE, name);
  const prompt = await fs.readFile(path.join(dir, cfg.promptFile), "utf-8");
  const outDir = path.join(dir, "output");
  await fs.mkdir(outDir, { recursive: true });

  console.log(`[${name}] generating distinct layout (no ref, fresh composition) ...`);
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `crowdworks-thumbnail-${name}-distinct`,
    imageName: cfg.outFile,
    refImages: [],
    cwd: REPO_ROOT,
    taskType: "showcase",
  });

  const outPath = path.join(outDir, cfg.outFile);
  await fs.writeFile(outPath, result.buffer);
  console.log(`[${name}] saved: ${outPath}`);
}

const target = process.argv[2];
if (!target) {
  console.error("usage: node generate-v3.mjs <target|all>");
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
