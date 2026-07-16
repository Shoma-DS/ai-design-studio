import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/sunshine-berry-uv-care-lp");
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

const SPECIFIC_LAYOUT = {
  "01-hero": `
────────────────
【このセクション固有の組み替え指定（最優先）】
左右2カラム構成にする。
・左カラム（全体の約40%）: 上から「4行見出しテキスト」→「商品パッケージ写真」→「ブランドロゴ（Sunshine Berry筆記体＋日本語ロゴ）」の順に縦に積む。
・右カラム（全体の約60%）: 微笑む女性の写真を、セクションの上端から下端まで達する大きなフルブリードで配置する。現状のように見出しの右上に小さく重ねるだけの構図にはしない。
・買い物帰りの友人グループ・自転車の女性・日傘の女性などのシルエットは、左右カラムの下、セクション最下部を横断する横長の帯として1列に並べる。写真の下に散らして重ねない。`,
  "02-product-info": `
────────────────
【このセクション固有の組み替え指定（最優先）】
3カラム構成にする。
・左カラム（約30%）: 商品パッケージ写真を縦方向中央に大きく配置する。
・中央カラム（約40%）: 商品名ロゴ・説明文・スペック（200mg×60粒）を縦に並べる。
・右カラム（約30%）: 独立した縦長の購入サイドバーとし、上から「サンシャインベリー（0件）／レビューを投稿する」リンク、SNSシェアアイコン列、価格表示（今回のみのお届け／お試し価格780円）、CTAボタン「買い物かごに入れる」を縦に積む。現状のように価格・CTAを画面下部の横長バーにしない。`,
  "03-ribbon": `
────────────────
【このセクション固有の指示（最優先）】
このセクションはテキスト1行のみの帯バナーで、要素数が少なく無理に左右分割・カラム化する構造がない。1200px幅でも間延びしないよう、リボンの横幅・厚み・左右の装飾（葉やしずくの模様）の配分をPC幅に合わせて調整し直してよいが、テキストを分割したり不要な要素を追加したりしない。`,
  "04-pain-points": `
────────────────
【このセクション固有の組み替え指定（最優先）】
2x2グリッドではなく、4枚の写真カードを横一列（1行4列）に並べる。各カードは上部に手書き風の悩みコピー、下部に写真を配置する。現状の2x2グリッド構成を維持しない。`,
  "05-grape": `
────────────────
【このセクション固有の組み替え指定（最優先）】
左右2カラムに明確に分割する。
・左カラム（約30%）: 縦書き風見出しテキスト（紫ぶどう種子の恵み／プロアントシアニジン）を縦方向中央に配置する。
・右カラム（約70%）: ぶどうの写真をセクション上端から下端まで達するフルブリードで配置する。現状のように写真が右下だけに寄ったり見出しと重なったりしない、左右の境界がはっきり分かる構図にする。`,
  "06-phytochemical": `
────────────────
【このセクション固有の組み替え指定（最優先）】
左右2カラムに分割する。
・左カラム（約45%）: 見出し「話題の栄養素『フィトケミカル』とは」と本文テキストを配置する。
・右カラム（約55%）: 現状は背景装飾でしかないぶどうの葉・つるのイラストを、独立した大きなイラストパネルとして配置する（テキストの背景に薄く敷くのではなく、右側に絵として見せる）。`,
  "07-comparison": `
────────────────
【このセクション固有の組み替え指定（最優先）】
左右2カラムに分割する。
・左カラム（約55%）: 見出し「アントシアニンより、プロアントシアニジン」と本文テキストを配置する。
・右カラム（約45%）: 現状は右下に小さく配置されている日傘をさして歩く女性のビジュアルを、カラム全体を使う大きなビジュアルとして配置する。小さな添え物にしない。`,
  "08-goldenberry": `
────────────────
【このセクション固有の組み替え指定（最優先）】
左右2カラムに分割する。
・左カラム（約50%）: ゴールデンベリーの写真をセクション上端から下端まで達するフルブリードで配置する。
・右カラム（約50%）: 現状は縦書きの見出し「ゴールデンベリー」を横書きの大見出しに変え、その下に本文テキストカードを配置する。現状のように写真の上に見出しを小さく重ねたり、テキストカードを写真下いっぱいに置いたりしない。`,
  "09-benefit": `
────────────────
【このセクション固有の組み替え指定（最優先）】
左右2カラムに分割する。
・左カラム（約35%）: 商品パッケージ写真を縦方向中央に大きく配置し、その下に召し上がり方の注記を置く。
・右カラム（約65%）: 上部に見出し「サンシャインベリー」とブランドロゴ、その下に3つのベネフィット帯（1.ベタつきが気にならない／2.塗り直し不要でずっと快適／3.忙しい朝でも粒を飲むだけ）を縦積みではなく横一列（3列）に並べる。現状のように3本の帯を縦に積まない。`,
  "10-lifestyle": `
────────────────
【このセクション固有の組み替え指定（最優先）】
見出し「いつものおでかけに、そっと寄り添う」を左カラム（約20%）に縦方向中央配置する。残りの右カラム（約80%）に4枚のライフスタイル写真（おでかけ・ドライブ・アウトドア・水辺のレジャー）を2x2グリッドではなく横一列（1行4列）に並べ、各写真に白背景ラベルタグを付ける。現状の2x2グリッド構成を維持しない。`,
  "11-quality": `
────────────────
【このセクション固有の組み替え指定（最優先）】
上部に見出し「SUNSHINE BERRY QUALITY」を全幅中央に配置する。その下は左に商品パッケージ写真（中サイズ）、右に3つの品質説明（簡易包装・ラベル・袋）を、縦の引き出し線リストではなく横一列（3列）のカードとして並べる。現状のように写真が縦長で左、テキストが引き出し線付きで縦に並ぶ構成にしない。最下部に製造に関する注記を全幅の帯として配置する。`,
};

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + PC_MOBILE_FIRST_INSTRUCTION + (SPECIFIC_LAYOUT[section.id] || "");
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
