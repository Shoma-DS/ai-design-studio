import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/agrume-citrus-cleansing-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const PC_MOBILE_FIRST_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する参照画像（同一セクションのスマホ版）のコピー・ブランド要素・配色・情報量・視線導線の「世界観」は踏襲するが、**要素の配置（レイアウト構造）はスマホ版のまま流用しない。PCの横幅を使って組み替えること。**
・具体的には次のいずれかに該当する要素があれば、必ず配置を変える:
  - 見出し・テキストブロックが写真の上または下にある → PCでは写真の横（左右どちらか）に並べる
  - カード・アイコン・特徴ブロックが3つ以上、縦1列または2列グリッドで並んでいる → PCでは横一列、または3列以上のグリッドに並べる
  - 「テキスト→写真→テキスト」のように縦に交互配置されている → PCでは左右2カラムに分割する
・単に用紙のサイズ・余白比率だけを変えて「スマホ版と同じ配置のまま少し横に広い版」を作ることは禁止。それは「作り直し」ではなく「サイズ変更」であり、この指示の目的に反する。
・縦横比は16:9などに固定せず、組み替えた結果として内容量に合った自然な高さにする（テキストが少なく要素も少ないセクションは、組み替えてもなおポートレートに近いままで構わないが、その場合も「なぜ横に組み替えようがないのか」を自問すること＝ほとんどのセクションは組み替え可能）。
・コピー・ブランド要素・配色・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない）
・1200px幅で表示したときに間延びせず、スマホ版と一貫した世界観に見える構図にする
・上下端は前後セクションへ自然につながる余白で終える
`;

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + PC_MOBILE_FIRST_INSTRUCTION;
  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-mobile-reference.png`, buffer: mobileBuffer }],
    cwd: repoRoot,
    taskType: "section",
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
console.log(`Generated ${selected.length} sections.`);
