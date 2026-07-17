import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/ashita-town-sdgs-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

// セクション別の強い構図組み替え指示（round2/round3ではPC/スマホがほぼ同一シルエットのまま
// 失敗したため、今回は各セクションごとに具体的な新レイアウトを明文化して強制する）
const STRUCTURAL_OVERRIDES = {
  "08-sdgs-board": `
────────────────
【PC版レイアウト再構成の指示（このセクション専用・最優先・厳守）】
このセクションは【PC/デスクトップ表示専用】として、max-width 1200pxのコンテナに中央配置される。
**禁止:** 参照画像（スマホ版）と同じ「看板フレーム内を左右に分割し、左に17マスアイコングリッド、右に見出し＋説明文」という配置をそのまま横に広げること。これは過去2回失敗した構成であり、今回は使わない。

**採用する新構成（看板を上下2段に分割する）:**
・木の看板フレームは横長のまま1つ使うが、フレーム内部を上下2段に分ける。
・上段（フレーム内の上半分、全幅）: 「みんなのめひょう」ロゴと17マスアイコングリッドを、横一列または2段×9列程度の「横広の並び」で全幅に配置する（アイコンを縦に積まない・左右どちらかに寄せない・全幅を使い切る横広グリッドにする）。
・下段（フレーム内の下半分、全幅）: 見出し「めひょうってな〜に？」と説明文を、上段の下に全幅のテキストブロックとして配置する（見出しは大きく中央または左寄せ、本文は横幅を活かして2〜3行程度の短い行で読みやすく折り返す）。
・アイコングリッドとテキストを左右に並べる配置は禁止。必ず上下（上段アイコン・下段テキスト）にする。
・フレーム外の背景（丘・木々・太陽・キャラクターたち）は参照画像の世界観を保つが、看板の下にキャラクターを立たせる構図など、S03/参照画像と同様の背景装飾は使ってよい。
・この結果、見出しまたはアイコングリッドのどちらかを取り除いても、スマホ版と同じシルエットには絶対に見えないこと（スマホ版は左右分割、PC版は上下分割という明確な違いを作る）。
`,
  "09-sdgs-gallery-audience": `
────────────────
【PC版レイアウト再構成の指示（このセクション専用・最優先・厳守）】
このセクションは【PC/デスクトップ表示専用】として、max-width 1200pxのコンテナに中央配置される。
**禁止:** 参照画像（スマホ版）と同じ「中央に大きい動画サムネイル1枚＋左右に小さいサムネイルを縦2列で添える、その下に観客キャラクターたちを横一列で並べる」という配置をそのまま横に広げること。過去2回はこれで失敗した。

**採用する新構成（左右2カラムに大きく分割する）:**
・画面全体を左右2カラムに分割する。左カラムは横幅の約65%、右カラムは約35%を使う。
・左カラム: 森の映画館フレームの中に、大きな中央スクリーン（メインのサムネイル動画、再生ボタン付き）を1つ大きく配置し、その下に小さめのサムネイルを横一列に並べたフィルムストリップ（横スクロール映画のコマのような帯）を配置する。サムネイルを中央スクリーンの左右に振り分けて配置する構成は使わない。
・右カラム: 縦方向のサイドバーとして、上から「見出し（みんなのめひょうギャラリー）」「説明文」「キャプション（こまったときは たすけあおう）」を縦に並べ、その下に観客キャラクターたち（ホシノ・タスケ・ミズキ・マモル・ドーナ・ハナなど）を横一列の後ろ姿ではなく、縦に積み重なるように、または3体ずつ2段に、スクリーンの方を向いて座っている構図で配置する。観客キャラクターを画面下端に横一列でずらりと並べる配置は禁止。
・キャプションは画面下部の全幅バーではなく、右カラムの中に収める。
・この結果、見出しまたはスクリーンのどちらかを取り除いても、スマホ版と同じシルエット（上から見出し→スクリーン→キャプション→観客一列という縦積み）には絶対に見えないこと。PC版は左右2カラムという明確に異なる構造にする。
`,
  "11-footer": `
────────────────
【PC版レイアウト再構成の指示（このセクション専用・最優先・厳守）】
このセクションは【PC/デスクトップ表示専用】として、max-width 1200pxのコンテナに中央配置される。
**禁止:** 参照画像（スマホ版）と同じ「4ブランド（ソラニワ／ハレノキ／にじいろパーク／まちの広場専門店街）を横一列に並べる」という配置をそのまま横に広げること。過去2回はこれで失敗した（スマホ版は同じ内容の行が重複しているだけだった）。

**採用する新構成（2×2グリッドに組み替える）:**
・上部中央: HOSHIZORA HOLDINGSロゴと「星空ホールディングス」の表記を配置する（変更なし）。
・ロゴの下: 4ブランドを「横一列4分割」ではなく「2行×2列のグリッド」で配置する。1行目左にソラニワ（ソラニワ星ヶ丘／ソラニワ川辺／ソラニワ北町）、1行目右にハレノキ（ハレノキ武蔵杉並／ハレノキ緑ヶ丘）、2行目左ににじいろパーク（にじいろパーク天音／にじいろパーク光が丘）、2行目右にまちの広場専門店街を配置する。各ブランドブロックの間には縦横に区切り線または十分な余白を入れ、明確に「4分割グリッド」と分かる構図にする。
・最下部中央: コピーライト表記を配置する（変更なし）。
・4ブランドが横一列に並ぶ配置は禁止。必ず2×2のグリッド配置にする。
・この結果、見出し（ロゴ）を取り除いても、スマホ版と同じシルエット（縦に長く伸びる1カラムの繰り返しリスト）には絶対に見えないこと。PC版は正方形に近い2×2ブロックという明確に異なる構造にする。
`,
};

const wantedIds = process.argv.slice(2);
const targetIds = wantedIds.length ? wantedIds : Object.keys(STRUCTURAL_OVERRIDES);
const selected = sections.filter((s) => targetIds.includes(s.id));

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  const override = STRUCTURAL_OVERRIDES[section.id];
  if (!override) {
    throw new Error(`No structural override defined for ${section.id}`);
  }
  console.log(`generate ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + override;
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
