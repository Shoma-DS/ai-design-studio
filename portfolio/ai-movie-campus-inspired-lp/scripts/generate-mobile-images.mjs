import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "../..");
const mobileDir = path.join(projectRoot, "lp/images/mobile");

const MOBILE_INSTRUCTION = `
────────────────
【スマートフォン専用レイアウトの指示（最優先・厳守）】
このセクションは【スマートフォン縦画面専用】のセクション画像として出力する。
・左右2カラムの要素は、必ず縦1カラムに積む（左右に並べない）
・横並びのアイコン・カード・ボタンが3つ以上ある場合は、2列グリッドまたは縦積みに構成する（横一列にしない）
・見出し・本文とも、スマートフォンで実寸表示した際に十分大きく読める文字サイズにする
・縦横比は9:16前後の縦長を基本にする（750px幅程度のスマートフォン縦型LPセクションとして出力する）
・上下端は前後セクションへ自然につながる余白で終える
`;

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 2), 6));

await fs.mkdir(mobileDir, { recursive: true });

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(section) {
  const outputPath = path.join(mobileDir, section.imageName);
  if (await exists(outputPath)) {
    console.log(`skip ${section.id}: already exists`);
    return;
  }
  console.log(`generate mobile ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + MOBILE_INSTRUCTION;
  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: section.id,
    imageName: section.imageName,
    cwd: repoRoot,
    taskType: "showcase",
  });
  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done mobile ${section.id}`);
}

let index = 0;
const failures = [];
async function worker() {
  while (index < selected.length) {
    const section = selected[index++];
    try {
      await generateOne(section);
    } catch (error) {
      failures.push({ id: section.id, error });
      console.error(`fail ${section.id}:`, error?.message || error);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, () => worker()));

if (failures.length) {
  console.error(`${failures.length} mobile image generation tasks failed.`);
  process.exitCode = 1;
} else {
  console.log(`Generated ${selected.length} mobile images.`);
}
