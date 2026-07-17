import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/flexa-warehouse-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const PC_INSTRUCTION = [
  "────────────────",
  "【PC版レイアウト再構成の指示（最優先・厳守）】",
  "このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。",
  "・添付する参照画像（同一セクションのスマホ版）のコピー・ブランド要素・配色・情報量・視線導線の「世界観」は踏襲するが、要素の配置（レイアウト構造）はスマホ版のまま流用しない。PCの横幅を使って組み替えること。",
  "・単に用紙のサイズ・余白比率だけを変えて「スマホ版と同じ配置のまま少し横に広い版」を作ることは禁止。それは「作り直し」ではなく「サイズ変更」であり、この指示の目的に反する。",
  "・縦横比は16:9などに固定せず、組み替えた結果として内容量に合った自然な高さにする。",
  "・コピー・ブランド要素・配色・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない）。",
  "・1200px幅で表示したときに間延びせず、スマホ版と一貫した世界観に見える構図にする。",
  "・上下端は前後セクションへ自然につながる余白で終える。",
].join("\n");

const sections = [
  {
    id: "02-hero",
    imageName: "02-hero.jpg",
    refDir: mobileDir,
    refName: "02-hero.jpg",
    outDir: imageDir,
    copy: [
      "見出し: 「つくる自由が、ひろがる。」「フレキシブルな倉庫建築。」",
      "チェックリスト3項目: 迅速な対応／柔軟なプランニング／高品質なシステム建築",
      "アイソメトリック3D倉庫建築イラスト（線画・淡いグレー、ブループリント風の補助線を背景に添える）",
    ].join("\n"),
    layout: [
      "白ベース、1200px幅のPC専用ヒーロー。",
      "現行のPC版は『見出し・チェックリストが左上、建物イラストが右側』という配置を、単にスマホ版から横に引き伸ばしただけで、テキストと建物が画面上部で重なり合う斜めの構図になってしまっている。これを次のように明確に作り替えること。",
      "・左カラムと右カラムを完全に分離した2カラム構成にする。左カラムは画面幅の約38〜42%を占め、見出し・チェックリストを画面の垂直方向でも中央寄りにゆったり配置する（上部に寄せない）。",
      "・右カラムは画面幅の約58〜62%を占め、アイソメトリック3D倉庫建築イラストを左カラムのテキストと重ならないよう、大きく単独で配置する。イラストの背景に薄いブループリント風のグリッド線を右カラム全体に広げてもよい。",
      "・チェックリスト3項目は縦積みのままでよいが、左カラム内でゆとりを持って配置し、スマホ版のような『上に詰め込まれた』印象にはしない。",
      "・下部に横並びボタン2個ぶん（「資料を見る」「ご相談窓口」）の余白のみ左カラム下部に確保し、ボタン風オブジェクトは描かない。",
      "・1200px幅コンテナで見たときに間延びしない、程よい高さにする（無理に横長にはしない）。",
    ].join("\n"),
  },
  {
    id: "06-photo-grid",
    imageName: "06-photo-grid.jpg",
    refDir: mobileDir,
    refName: "06-photo-grid.jpg",
    outDir: imageDir,
    copy: [
      "見出し: 「業種も規模もさまざまな倉庫」",
      "実写風（架空）倉庫・施設の外観写真8枚、各キャプション付き:",
      "食品物流センター／自動車部品倉庫／医薬品保管施設／物流センター事務所棟／小売店舗倉庫／複合型施設／EC配送センター／冷凍冷蔵倉庫",
    ].join("\n"),
    layout: [
      "白背景、1200px幅のPC専用セクション。",
      "現行のPC版は2列×4行グリッドで、スマホ版（2列グリッド）と列数が同じまま単にサイズを変えただけになっている。PCの横幅を活かし、必ず4列×2行のグリッドに組み替えること（2列のままにしない）。",
      "上部中央に見出し「業種も規模もさまざまな倉庫」を配置。",
      "その下に、実写風倉庫・施設の外観写真8枚を4列×2行のグリッドで配置し、各写真の直下にキャプション（食品物流センター／自動車部品倉庫／医薬品保管施設／物流センター事務所棟／小売店舗倉庫／複合型施設／EC配送センター／冷凍冷蔵倉庫）を添える。",
      "1200px幅コンテナで見たときに縦に間延びしない、横に広いグリッドの比率にする。",
    ].join("\n"),
  },
];

const MOBILE_INSTRUCTION = [
  "────────────────",
  "【スマートフォン専用レイアウトの指示（最優先・厳守）】",
  "このセクションは【スマートフォン縦画面専用】のセクション画像として出力する。",
  "・左右2カラムの要素は、必ず縦1カラムに積む（左右に並べない）",
  "・横並びのアイコン・カード・ボタンが3つ以上ある場合は、2列グリッドまたは縦積みに構成する（横一列にしない）",
  "・見出し・本文とも、スマートフォンで実寸表示した際に十分大きく読める文字サイズにする",
  "・750px幅のスマートフォン縦型LPセクションとして出力し、高さは内容に合わせて自然に調整する",
  "・上下端は前後セクションへ自然につながる余白で終える",
].join("\n");

const mobileSections = [
  {
    id: "09-footer",
    imageName: "09-footer.jpg",
    refDir: imageDir,
    refName: "09-footer.jpg",
    outDir: mobileDir,
    copy: [
      "ダークネイビー背景。ブループリント風の倉庫建築線画を薄く背景に添える。",
      "中央に角丸のFLEXAロゴマーク（オリジナル図形、白線）",
      "ロゴ下に「FLEXA」ワードマーク（白、太めのレタースペーシング）",
      "その下にタグライン「ビジネスと創造を支える、倉庫づくり。」",
    ].join("\n"),
    layout: [
      "縦1カラム、750px幅のスマートフォン縦型フッターセクション。",
      "上から1/3程度の高さに、ロゴマーク・FLEXAワードマーク・タグラインを中央揃えで配置する。",
      "下半分は、後からCTAボタン2個（「お問合せはこちら」「資料ダウンロード」、縦積み）を重ねて配置するための余白として、ダークネイビー無地またはごく薄いブループリント線のみを残す（ボタン風オブジェクト自体は描かない）。",
      "PC版（参照画像）と同じダークネイビー×白のブランドトーン・ロゴ・コピーを完全に保つ。",
    ].join("\n"),
  },
];

async function generateOne(section, instruction, taskSuffix) {
  const refPath = path.join(section.refDir, section.refName);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate ${taskSuffix}${section.id}`);

  const prompt = [
    `セクション: ${section.id}`,
    "",
    "LPコピー:",
    section.copy,
    "",
    "構図:",
    section.layout,
    "",
    instruction,
  ].join("\n");

  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `${taskSuffix}${section.id}`,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-reference.jpg`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  const rawPath = path.join(section.outDir, `${section.id}.raw.png`);
  await fs.writeFile(rawPath, generated.buffer);
  console.log(`done ${taskSuffix}${section.id} -> ${rawPath}`);
}

const wantedIds = new Set(process.argv.slice(2));

async function run() {
  const pcSelected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;
  for (const section of pcSelected) {
    try {
      await generateOne(section, PC_INSTRUCTION, "pc-redesign-");
    } catch (error) {
      console.error(`fail pc-redesign-${section.id}:`, error?.message || error);
      process.exitCode = 1;
    }
  }

  const mobileSelected = wantedIds.size ? mobileSections.filter((s) => wantedIds.has(s.id)) : mobileSections;
  for (const section of mobileSelected) {
    try {
      await generateOne(section, MOBILE_INSTRUCTION, "mobile-new-");
    } catch (error) {
      console.error(`fail mobile-new-${section.id}:`, error?.message || error);
      process.exitCode = 1;
    }
  }
}

await run();
