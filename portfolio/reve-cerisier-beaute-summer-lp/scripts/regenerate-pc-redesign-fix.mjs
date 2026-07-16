import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/reve-cerisier-beaute-summer-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const outDir = path.join(imageDir, "pc-redesign-new");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

// skills/design/lp-responsive/SKILL.md の強化版プロンプト（PC版レイアウト再構成の指示・最優先・厳守）
const PC_REDESIGN_INSTRUCTION = `
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

// セクション個別の追加指示（1回目の再生成でまだ「サイズ変更のみ」寄りだった場合に強化する）
const EXTRA_INSTRUCTION_BY_ID = {
  "05-korugi-effect": `
────────────────
【このセクション特有の追加指示（最優先・厳守）】
1回目の生成結果は、スマホ版と同じ縦積みのカードグリッド構成をそのまま少し拡大しただけで、幅も1200pxコンテナに対して狭い（900px前後の縦長）ままだった。今回は必ず以下を満たすこと。
・画像の横幅は1200pxコンテナいっぱいに使う横長〜正方形に近い構図にする（900px前後の細い縦長にしない）
・上部の「コルギの効果 Effect」見出し・吹き出し・キャラクターは、右にキャラクターを大きく配置しつつ、小顔への効果／美背中への効果の2ボックスと同じ横一列（3カラム）にまとめる
・「こんなお悩みありませんか？」「そのお悩み、コルギでアプローチ！」「理想の未来へ！」の3段のカード群は、単純に4枚ずつ3段を縦に積むのではなく、対応するお悩み→アプローチ→結果を1つの悩みごとに縦につなげた4列×3段のテーブル状グリッドとして横幅いっぱいに大きく配置し、視線が左から右へ、各列は上から下へ流れるようにする（内容・コピーは変更しない）
・最下部の締め文とピンクバッジも横幅いっぱいに使い、左右に余裕を持たせて配置する
`,
};

await fs.mkdir(outDir, { recursive: true });

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

async function generateOne(section) {
  const outputPath = path.join(outDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const extra = EXTRA_INSTRUCTION_BY_ID[section.id] || "";
  const prompt = buildPrompt(section) + PC_REDESIGN_INSTRUCTION + extra;
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
  try {
    await generateOne(section);
  } catch (error) {
    console.error(`FAILED ${section.id}: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
console.log(`Generated ${selected.length} sections (see log for individual failures).`);
