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

const section = {
  id: "09-footer",
  imageName: "09-footer.jpg",
  refDir: mobileDir,
  refName: "09-footer.jpg",
  outDir: imageDir,
  copy: [
    "ダークネイビー背景。ブループリント風の倉庫建築線画を薄く背景に添える。",
    "角丸のFLEXAロゴマーク（オリジナル図形、白線）",
    "「FLEXA」ワードマーク（白、太めのレタースペーシング）",
    "タグライン「ビジネスと創造を支える、倉庫づくり。」",
  ].join("\n"),
  layout: [
    "白ヌキ・ダークネイビー背景、1200px幅のPC専用フッターセクション。",
    "現行のPC版は、スマホ版と全く同じ『中央にロゴマーク→FLEXAワードマーク→タグラインを縦に積んで中央揃え』という構成のまま、背景の建築線画を横に引き伸ばしただけになっている。これを次のようにPCの横幅を活かして明確に作り替えること。",
    "・ロゴマーク（角丸六角形のFアイコン）とテキストブロック（FLEXAワードマーク＋タグライン）を、縦に積むのではなく横に並べる。ロゴマークを画面中央よりやや左に大きめに配置し、その右側にFLEXAワードマークとタグラインを2行で縦に並べて隣接させる（ロゴ＋ワードマーク＋タグラインのまとまりを、画面全体の水平方向でおおよそ中央に配置する）。",
    "・このロゴ＋テキストのまとまりの左右に、余白装飾として細い縦のブループリント罫線・小さな寸法補助線・点（基準点マーカー）などの薄い線画装飾を対称に配置する（左右対称でなくてよいが、左右どちらの余白にも何らかの装飾があること）。左右の余白を完全な無地にしない。",
    "・背景全体には、現行同様に薄い倉庫建築のブループリント線画（建物のアイソメトリック輪郭・グリッド線）を、画面全体に薄く広がるパターンとして敷く。単なる横引き伸ばしではなく、左右の余白部分にも模様が自然に続くようにする。",
    "・ロゴ＋テキストのまとまりは画面の上から40〜48%程度の高さに水平中央配置し、画面下側30%前後は、後からCTAボタン2個（横並び、「お問合せはこちら」「資料ダウンロード」）を重ねて配置するための余白として、ダークネイビー無地またはごく薄いブループリント線のみを残す（ボタン風オブジェクト自体は描かない）。",
    "・コピー・ブランド要素・配色（ダークネイビー×白）・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない）。",
    "・1200px幅コンテナで見たときに間延びせず、スマホ版と一貫した世界観に見える構図にする。中央にロゴだけがぽつんと置かれた寂しい印象にはしない。",
    "・上下端は前後セクションへ自然につながる余白で終える。",
  ].join("\n"),
};

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

async function run() {
  const refPath = path.join(section.refDir, section.refName);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate pc-footer-fix-round2-${section.id}`);

  const prompt = [
    `セクション: ${section.id}`,
    "",
    "LPコピー:",
    section.copy,
    "",
    "構図:",
    section.layout,
    "",
    PC_INSTRUCTION,
  ].join("\n");

  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `pc-footer-fix-round2-${section.id}`,
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
  console.log(`done pc-footer-fix-round2-${section.id} -> ${rawPath}`);
}

await run();
