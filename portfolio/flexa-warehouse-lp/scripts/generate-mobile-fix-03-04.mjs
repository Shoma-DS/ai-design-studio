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

const sections = [
  {
    id: "03-concept",
    imageName: "03-concept.jpg",
    copy: [
      "見出し: 「設計・コスト・スタッフ　全てに、柔軟な対応力」",
      "説明文: 「FLEXAは、企画・設計からコスト管理、現場スタッフの手配まで、システム建設のあらゆる工程を柔軟にサポート。お客様の課題や条件に合わせて最適な体制とプランを構築し、高品質な空間づくりを実現します。」",
      "中央に角丸六角形のFLEXAロゴマーク（オリジナル図形）。そこから5つの工程ノードへ点線が伸びる: 設計・プランニング／システム建設／コスト管理／資材・工程管理／現場スタッフ手配。各ノードにはアイソメトリック線画の小さな挿絵（建物・トラック・電卓と書類など）を添える。",
    ].join("\n"),
    layout:
      "縦1カラム。上から順に: 見出し2行→説明文→FLEXAロゴマークを中心にした工程ダイアグラム（5ノードを縦方向のフローまたは2列グリッドで配置し直す。左右2カラムには絶対にしない）。ダイアグラムの各ノードのラベル文字は指でも判読できる十分な大きさにする。下部に右下寄せでテキストリンク1個分（「会社情報を見る」）の余白のみ確保し、リンク風オブジェクト自体は描かない。",
  },
  {
    id: "04-news",
    imageName: "04-news.jpg",
    copy: [
      "見出し: 「NEWS」（左に短い横線アクセント）",
      "日付＋お知らせ見出し3件を、それぞれ薄い罫線区切りで縦に並べる:",
      "2026.05.12　施工実績ページを更新しました。",
      "2026.04.03　新商品シリーズ「MATCH-Duo」の提供を開始しました。",
      "2026.03.18　本社移転に伴う一時休業のお知らせ。",
    ].join("\n"),
    layout:
      "縦1カラム、750px幅のスマートフォン縦型セクション。上部に見出し「NEWS」。その下に日付＋見出しの3行を、罫線区切りで縦に並べる（1行1件、横一列には並べない）。右下の背景に控えめなアイソメトリック建築線画を小さく添えてもよいが、テキストの可読性を妨げないよう縮小・配置する。上下端は前後セクションへ自然につながる余白で終える。",
  },
];

async function generateOne(section) {
  const refPath = path.join(imageDir, section.imageName);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate mobile/${section.id}`);

  const prompt = [
    `セクション: ${section.id}（スマートフォン専用モバイル版の作り直し）`,
    "",
    "LPコピー:",
    section.copy,
    "",
    "構図:",
    section.layout,
    "",
    "────────────────",
    "【スマートフォン専用レイアウトの指示（最優先・厳守）】",
    "このセクションは【スマートフォン縦画面専用】のセクション画像として出力する。",
    "・左右2カラムの要素は、必ず縦1カラムに積む（左右に並べない）",
    "・横並びのアイコン・カード・ボタンが3つ以上ある場合は、2列グリッドまたは縦積みに構成する（横一列にしない）",
    "・見出し・本文とも、スマートフォンで実寸表示した際に十分大きく読める文字サイズにする",
    "・750px幅のスマートフォン縦型LPセクションとして出力し、高さは内容に合わせて自然に調整する（横長にしない）",
    "・上下端は前後セクションへ自然につながる余白で終える",
    "・添付する参照画像（現行PC版）とブランドトーン（ダークネイビー×白、線画イラストのスタイル）・コピー・情報量は完全に同じに保つ。参照画像は配色・ブランド確認用であり、そのレイアウト（横並び）は踏襲しない。",
  ].join("\n");

  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `mobile-${section.id}`,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-pc-reference.jpg`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  const rawPath = path.join(mobileDir, `${section.id}.raw.png`);
  await fs.writeFile(rawPath, generated.buffer);
  console.log(`done mobile/${section.id} -> ${rawPath}`);
}

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

for (const section of selected) {
  try {
    await generateOne(section);
  } catch (error) {
    console.error(`fail mobile/${section.id}:`, error?.message || error);
    process.exitCode = 1;
  }
}
