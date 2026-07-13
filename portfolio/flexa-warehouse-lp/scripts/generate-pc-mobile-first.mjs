import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/flexa-warehouse-lp");
const imageDir = path.join(projectRoot, "lp/images");
const backupDir = path.join(projectRoot, "references/pre-1200px-mobile-first");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const sections = [
  {
    id: "02-hero",
    imageName: "02-hero.jpg",
    copy: [
      "見出し: 「つくる自由が、ひろがる。」「フレキシブルな倉庫建築。」",
      "チェックリスト3項目: 迅速な対応／柔軟なプランニング／高品質なシステム建築",
      "アイソメトリック3D倉庫建築イラスト（線画・淡いグレー）",
    ].join("\n"),
    layout:
      "白ベース。見出しとチェックリスト3項目を左側の縦テキストブロックに、アイソメトリック3D倉庫イラストを右側に大きく配置する自然な2カラム構成。下部に横並びボタン2個ぶん（「資料を見る」「ご相談窓口」）の余白のみ確保し、ボタン風オブジェクトは描かない。1200px幅コンテナで見たときに間延びしない、程よい高さにする（無理に横長にはしない）。",
  },
  {
    id: "03-concept",
    imageName: "03-concept.jpg",
    copy: [
      "見出し: 「設計・コスト・スタッフ　全てに、柔軟な対応力」",
      "説明文（システム建築の柔軟さを訴求）",
      "FLEXAの角丸ロゴマーク（オリジナル図形）",
    ].join("\n"),
    layout:
      "白ベース。見出し・説明文・オリジナルロゴマークを配置。右下にテキストリンク1個ぶん（「会社情報を見る」）の余白のみ確保。既存画像は既に1200px幅で自然に収まる横長構図なので、その構図を踏襲しつつコピー・配色を保ったまま作り直す。",
  },
  {
    id: "04-news",
    imageName: "04-news.jpg",
    copy: ["薄いグレー帯。日付＋お知らせ見出し3件（架空の日付・内容）"].join("\n"),
    layout:
      "薄いグレー背景の帯。日付＋お知らせ見出しを3件、横一列または適度な余白で配置。既存画像は既に1200px幅で自然に収まる横長の帯なので、その構図を踏襲しつつ作り直す。",
  },
  {
    id: "05-case-study",
    imageName: "05-case-study.jpg",
    copy: [
      "見出し: 「システム建築を活かして、お客様の様々なCASEにお応えします」",
      "Case01: こだわった建物をつくりたいけど、開業時期が迫っている",
      "Case02: とにかくコストを最小限に抑えたい",
      "Case03: 柱のない、大空間をつくりたい",
      "Case04: 倉庫と事務所を両方つくりたい",
    ].join("\n"),
    layout:
      "ダークネイビー背景。上部に見出し。Case01〜04の4枚のカードを、実際に横に並べて比較できる内容なので4列横並びのグリッドで配置する（参照画像のような縦4段積みにはしない）。各カードにはアイソメトリック小アイコン＋見出し＋説明文を焼き込む。各カード右下に「事例を見る ›」リンク1個ぶんの余白のみ確保し、リンク風オブジェクトは描かない。1200px幅コンテナに自然に収まる、極端に縦長にならない高さにする。",
  },
  {
    id: "06-photo-grid",
    imageName: "06-photo-grid.jpg",
    copy: ["見出し: 「業種も規模もさまざまな倉庫」", "実写風（架空）倉庫・施設の外観写真を2列×4行、各キャプション付き"].join("\n"),
    layout:
      "白背景。上部に見出し。実写風倉庫・施設の外観写真を2列×4行のグリッドで配置し、各キャプションを添える。1200px幅コンテナで見たときに極端に縦長にならないよう、グリッドの列数バランスを保ちつつ作り直す（内容量が多いので完全な横長バナーにはしない）。",
  },
];

async function generateOne(section) {
  const refPath = path.join(backupDir, section.imageName);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate ${section.id}`);

  const prompt = [
    `セクション: ${section.id}`,
    "",
    "LPコピー:",
    section.copy,
    "",
    "構図:",
    section.layout,
    "",
    "────────────────",
    "【PC版レイアウト再構成の指示（最優先・厳守）】",
    "このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。",
    "・添付する参照画像（現行のスマホ/共通版）の情報設計・要素の並び順・余白のリズム・視線導線・アイコンや挿絵のスタイルを踏襲する",
    "・スマホ版を単純に横へ引き伸ばした横長バナーにはしない。縦横比は16:9などに固定せず、このセクションの内容量に合った自然な高さにする",
    "・コピー・ブランド要素・配色・情報量は参照画像と完全に同じに保つ（情報を削らない・足さない）",
    "・1200px幅で表示したときに間延びせず、参照画像と一貫した世界観に見える構図にする",
    "・ダークネイビー×白ベースのブランドトーンを保つ",
  ].join("\n");

  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-reference.jpg`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  const rawPath = path.join(imageDir, `${section.id}.raw.png`);
  await fs.writeFile(rawPath, generated.buffer);
  console.log(`done ${section.id} -> ${rawPath}`);
}

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

for (const section of selected) {
  try {
    await generateOne(section);
  } catch (error) {
    console.error(`fail ${section.id}:`, error?.message || error);
    process.exitCode = 1;
  }
}
