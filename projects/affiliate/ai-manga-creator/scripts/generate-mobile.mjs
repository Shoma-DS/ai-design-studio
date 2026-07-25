import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const projectRoot = path.join(repoRoot, "projects/affiliate/ai-manga-creator");
const mobileDir = path.join(projectRoot, "lp/images/mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const aspectGuidePath = path.join(projectRoot, "references/aspect-guide-mobile.png");

const MOBILE_INSTRUCTION = `
────────────────
【スマートフォン専用レイアウトの指示（最優先・厳守）】
このセクションは【スマートフォン縦画面専用】のセクション画像として出力する。
・添付した参照画像は真っ白なキャンバスで、内容ではなく「縦横比（幅864:高さ1821程度の縦長）」だけを示す型紙。この縦横比に合わせて出力し、白紙の中身は無視して以下のコピー・レイアウト指示どおりの内容を描く
・横長（幅が高さより大きい）で出力することは禁止。必ず縦長で出力する
・左右2カラムの要素は、必ず縦1カラムに積む（左右に並べない）
・横並びのアイコン・カード・ボタンが3つ以上ある場合は、2列グリッドまたは縦積みに構成する（横一列にしない）
・見出し・本文とも、スマートフォンで実寸表示した際に十分大きく読める文字サイズにする
・上下端は前後セクションへ自然につながる余白で終える（次セクションの要素を絶対に写り込ませない）
`;

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

await fs.mkdir(mobileDir, { recursive: true });

const aspectGuideBuffer = await fs.readFile(aspectGuidePath);

async function generateOne(section) {
  const outputPath = path.join(mobileDir, section.imageName);
  console.log(`generate ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + MOBILE_INSTRUCTION;
  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `${section.id}-mobile`,
    imageName: section.imageName,
    refImages: [{ name: "aspect-guide-mobile.png", buffer: aspectGuideBuffer }],
    cwd: repoRoot,
    taskType: "showcase",
  });
  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

for (const section of selected) {
  await generateOne(section);
}
console.log(`Generated ${selected.length} mobile sections.`);
