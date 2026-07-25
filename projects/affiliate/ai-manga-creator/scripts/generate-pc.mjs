import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const projectRoot = path.join(repoRoot, "projects/affiliate/ai-manga-creator");
const pcDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(projectRoot, "lp/images/mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const aspectGuidePath = path.join(projectRoot, "references/aspect-guide-pc.png");

const PC_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する2枚の参照画像のうち、1枚目（真っ白なキャンバス）は「縦横比（幅1536:高さ1024程度の横長）」だけを示す型紙。この縦横比に合わせて出力し、白紙の中身は無視する
・2枚目は同一セクションのスマホ版完成画像。コピー・ブランド要素・配色・情報量・視線導線の「世界観」は踏襲するが、**要素の配置（レイアウト構造）はスマホ版のまま流用しない。PCの横幅を使って組み替えること。**
・具体的には次のいずれかに該当する要素があれば、必ず配置を変える:
  - 見出し・テキストブロックが写真の上または下にある → PCでは写真の横（左右どちらか）に並べる
  - カード・アイコン・特徴ブロックが3つ以上、縦1列または2列グリッドで並んでいる → PCでは横一列、または3列以上のグリッドに並べる
  - 「テキスト→写真→テキスト」のように縦に交互配置されている → PCでは左右2カラムに分割する
・単に用紙のサイズ・余白比率だけを変えて「スマホ版と同じ配置のまま少し横に広い版」を作ることは禁止。それは「作り直し」ではなく「サイズ変更」であり、この指示の目的に反する。
・縦横比は16:9前後の横長を基本にする（横1536×縦1024px程度）。内容量が極端に多いセクションのみ、多少縦に伸びることを許容する。
・横長（高さが幅より大きい）で出力することは禁止。必ず横長で出力する
・コピー・ブランド要素・配色・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない）
・1200px幅で表示したときに間延びせず、スマホ版と一貫した世界観に見える構図にする
・上下端は前後セクションへ自然につながる余白で終える（次セクションの要素を絶対に写り込ませない）
`;

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

await fs.mkdir(pcDir, { recursive: true });

const aspectGuideBuffer = await fs.readFile(aspectGuidePath);

async function generateOne(section) {
  const outputPath = path.join(pcDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate PC ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + PC_INSTRUCTION;
  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `${section.id}-pc`,
    imageName: section.imageName,
    refImages: [
      { name: "aspect-guide-pc.png", buffer: aspectGuideBuffer },
      { name: `${section.id}-mobile-reference.png`, buffer: mobileBuffer },
    ],
    cwd: repoRoot,
    taskType: "showcase",
  });
  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done PC ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

for (const section of selected) {
  await generateOne(section);
}
console.log(`Generated ${selected.length} PC sections.`);
