import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/flexa-warehouse-lp");
const imageDir = path.join(projectRoot, "lp/images");

const sections = [
  {
    id: "02-hero",
    imageName: "02-hero.jpg",
    prompt: `倉庫・システム建築ブランド「FLEXA（フレクサ）」のLPヒーローセクション画像を作る。
【構図】16:9横長。左〜中央にアイソメトリック3D倉庫建築イラスト（線画・淡いグレー、白ベース）、右側または中央上部に見出しテキストを配置。
【見出し】メイン「つくる自由が、ひろがる。」／サブ「フレキシブルな倉庫建築。」
【チェックリスト】3項目を横並びまたは縦並びで小さく配置：「迅速な対応」「柔軟なプランニング」「高品質なシステム建築」
【余白確保（重要）】画面下部中央〜左寄りに、ボタン2個分（幅220px高さ50px程度×2個、横並び）を配置できる空白（無地または淡い背景のみ）を確保する。ボタン風のオブジェクト自体は描かない。
【トーン】白基調でクリーン、線画イラスト中心。
1600x900px程度の16:9横長画像として出力する。`,
  },
  {
    id: "03-concept",
    imageName: "03-concept.jpg",
    prompt: `FLEXA（フレクサ）LPのコンセクトセクション画像を作る。
【構図】16:9横長。左側に見出しと説明文、右側にFLEXAの角丸ロゴマーク（オリジナル図形、実在ロゴ模写禁止）。
【見出し】「設計・コスト・スタッフ　全てに、柔軟な対応力」
【説明文】システム建築による倉庫・施設建築を、設計・コスト・スタッフ対応まで柔軟にサポートすることを伝える1〜2文。
【余白確保（重要）】画面右下に、テキストリンク1個分（幅140px高さ24px程度）を配置できる空白を確保する。リンク風のテキストオブジェクト自体は描かない。
【トーン】白基調でクリーン。
1600x900px程度の16:9横長画像として出力する。`,
  },
  {
    id: "04-news",
    imageName: "04-news.jpg",
    prompt: `FLEXA（フレクサ）LPのお知らせセクション画像を作る。
【構図】16:9横長。薄いグレー帯背景に、日付＋お知らせ見出しを3件、横一列または縦に整列して配置。
【内容例（架空の日付・内容）】
・2026.05.12　新商品シリーズ「MATCH-Duo」提供開始のお知らせ
・2026.04.03　施工事例ページを更新しました
・2026.03.18　メンテナンスに伴うサービス一時停止のお知らせ
【トーン】白〜薄いグレー基調でクリーン、インタラクション要素なし。
1600x900px程度の16:9横長画像として出力する。`,
  },
  {
    id: "05-case-study",
    imageName: "05-case-study.jpg",
    prompt: `FLEXA（フレクサ）LPのケーススタディセクション画像を作る。
【構図】16:9横長。ダークネイビー背景。上部中央に見出し、その下に4つのカードを【横一列（4列グリッド）】で配置する（縦積みにしない）。
【見出し】「システム建築を活かして、お客様の様々なCASEにお応えします」
【カード内容】各カードにアイソメトリック小アイコン＋見出し＋説明文を焼き込む。
・Case01: こだわった建物をつくりたいけど、開業時期が迫っている
・Case02: とにかくコストを最小限に抑えたい
・Case03: 柱のない、大空間をつくりたい
・Case04: 倉庫と事務所を両方つくりたい
【余白確保（重要）】各カードの右下（または下部）に、「事例を見る ›」リンク1個分（幅110px高さ20px程度）を配置できる空白を4カード分確保する。リンク風オブジェクト自体は描かない。
【トーン】ダークネイビー基調、アイソメトリック線画アイコン。
1600x900px程度の16:9横長画像として出力する。`,
  },
  {
    id: "06-photo-grid",
    imageName: "06-photo-grid.jpg",
    prompt: `FLEXA（フレクサ）LPの施工事例フォトグリッドセクション画像を作る。
【構図】16:9横長。上部に見出し、その下に実写風（架空）倉庫・施設の外観写真を横並びグリッド（例: 4列×2行、または3列×2行）で配置し、各写真に小さいキャプションを添える。
【見出し】「業種も規模もさまざまな倉庫」
【トーン】白背景、実写風（架空）倉庫・施設写真、インタラクション要素なし。
1600x900px程度の16:9横長画像として出力する。`,
  },
];

async function generateOne(section) {
  const refPath = path.join(imageDir, section.imageName);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate ${section.id}`);
  const generated = await generateImageWithCodexAppServer({
    prompt: section.prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-reference.jpg`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });
  if (!generated.configured) {
    throw new Error(generated.message || "not configured");
  }
  const outPath = path.join(imageDir, section.imageName.replace(/\.jpg$/, "-16x9.png"));
  await fs.writeFile(outPath, generated.buffer);
  console.log(`done ${section.id}: ${outPath}`);
}

const wanted = new Set(process.argv.slice(2));
const selected = wanted.size ? sections.filter((s) => wanted.has(s.id)) : sections;

for (const section of selected) {
  try {
    await generateOne(section);
  } catch (error) {
    console.error(`fail ${section.id}:`, error?.message || error);
  }
}
