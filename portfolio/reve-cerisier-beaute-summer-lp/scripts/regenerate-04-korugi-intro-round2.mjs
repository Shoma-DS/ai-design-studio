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

// 1回目の生成結果は、スマホ版とほぼ同一のシルエット（見出し・バッジ・3アイコンが上、
// キャラクターが右上、コルギとはボックスが全幅、2カラムボックスが下）を単に少し細長くしただけで、
// 956x1646という縦長のままだった。今回は必ず横幅を全面的に使う構成に組み替える。
const EXTRA_INSTRUCTION = `
────────────────
【このセクション特有の追加指示（最優先・厳守）】
1回目の生成結果は、スマホ版とほぼ同じ縦積みのシルエット（上から: リボン見出し→大見出し→3アイコン→コルギとはボックス→2カラムボックスの順に縦に並ぶだけ）をわずかに細くしただけで、956×1646という細い縦長のままだった。今回は必ず以下を満たす、明確に横長寄りの構成にすること。
・画像全体は1200pxコンテナの横幅をいっぱいに使い、高さは900〜1100px程度に収める横長〜正方形に近い構図にする（1600px超の縦長は禁止）
・上段は「左右2カラム」に分割する: 左カラム（横幅の45%程度）にピンクリボン見出し「夏にこそ手に入れたい！」・大見出し「夏こそ、コルギ。」とサブコピー・説明文・3アイコンバッジ（すっきり小顔／美しい背中／巡り・代謝UP）を縦に配置する。右カラム（横幅の55%程度）には右上に「特別インタビュー」バッジを置き、その下にビーチで振り返る後ろ姿の3Dキャラクタービジュアルを大きく配置する。左右カラムは同じ高さで、上下に積まない。
・中段の「コルギとは？」白ボックスは横幅いっぱいに使い、左にテキスト説明、右に施術中の女性の丸型写真を横並びに配置する（今回のようにテキストが先に来て写真が右下に小さく収まる形ではなく、テキストブロックと写真を左右で同じ高さに揃える）
・下段の「こんな方におすすめ」ボックスと「夏の肌見せは後ろ姿で差がつく」ボックスは、引き続き横に2分割で並べるが、1200px幅いっぱいまで左右に広げ、間延びしないよう余白を調整する
・コピー・アイコンの文言・チェックリストの項目数は変更しない（情報を削らない・足さない）
・上下端は前後セクションへ自然につながる余白で終える
`;

const section = sections.find((s) => s.id === "04-korugi-intro");
const outputPath = path.join(outDir, section.imageName);
const mobilePath = path.join(mobileDir, section.imageName);
const mobileBuffer = await fs.readFile(mobilePath);

console.log(`generate ${section.id} (round2): ${section.title}`);
const prompt = buildPrompt(section) + PC_REDESIGN_INSTRUCTION + EXTRA_INSTRUCTION;
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
