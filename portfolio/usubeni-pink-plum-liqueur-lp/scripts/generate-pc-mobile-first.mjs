import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/usubeni-pink-plum-liqueur-lp");
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

// セクションごとに「配置をどう組み替えるか」を明示するための固有指示。
// 汎用ルールだけでは「テキストのみの帯」「全面写真＋テキスト重ね」のような
// セクションで具体的な組み替え方が伝わらず、単純拡大に戻りやすいため追加する。
const SECTION_SPECIFIC_INSTRUCTION = {
  "02-intro-price": `
────────────────
【このセクション固有のPC構図指示（最優先）】
・スマホ版は見出し帯→区切り線→商品名→価格→予約期間→注記を上から下へ中央揃えで一列に積んでいるが、PC版ではこの縦積みのまま横に引き伸ばさない。
・見出し帯は上部中央、商品名はその下に中央大きく配置したあと、価格ブロックと予約期間ブロックを細い縦の区切り線で仕切って左右に並べる「横並びの情報バー」として再構成する（価格と予約期間を上下に積まない）。
・注記はその情報バーの下に中央で添える。
`,
  "03-mood-photo": `
────────────────
【このセクション固有のPC構図指示（最優先）】
・スマホ版は全面写真の上に見出し・本文を中央で重ねる構成だが、PC版ではそのまま横に引き伸ばさない。
・写真を画面の片側（左右どちらか）約55〜60%に配置し、残りを写真の色調に合わせた紅色系の単色または控えめなグラデーション背景にして、見出し・本文のテキストブロックをそちら側へ独立したパネルとして配置する「写真とテキストの左右2分割構図」に組み替える。
・テキストを写真の上に重ねる表現は使わない。
`,
  "04-gallery-grid": `
────────────────
【このセクション固有のPC構図指示（最優先・厳守。過去に単純な左右2分割へ戻ってしまった実績があるため、以下を数値レベルで厳密に守ること）】

これまでの生成結果は、スマホ版と同じ「同じ高さ・同じ幅比率の縦長矩形2枚が中央の1本の縦線で接して左右に並ぶ」構図をPCでも繰り返してしまっていた。**その構図は禁止。今回は写真の主従関係が一目で分かる非対称なコラージュ配置にする。**

■ 使う写真は今まで通り2枚（左写真＝グラス2脚の俯瞰写真、右写真＝ボトル2本のクローズアップ）。トリミング対象・内容は変えない。

■ 具体的な配置（このとおりに配置する）:
1. 「グラス2脚の俯瞰写真」を**メインの大きな写真**として、セクション全体の左側、横幅の約65%を占める大きな矩形で配置する。この写真はセクションの上端から下端まで、ほぼフル高さで表示する。
2. 「ボトル2本のクローズアップ写真」は**サブの小さな写真**として、大きな写真よりも明確に小さいサイズ（横幅は大きな写真の半分以下、セクション全体の横幅の30〜35%程度）にする。
3. サブ写真は、メイン写真の右下角にオーバーラップするように重ねて配置する。具体的には、サブ写真の上端がメイン写真の下端よりも上（メイン写真の下半分〜3分の1あたりの高さ）から始まり、メイン写真の右端を少しはみ出して右側の余白まで続き、サブ写真の下端はメイン写真の下端よりもさらに下まで伸びる形にする。つまり「メイン写真の右下に、もう1枚の写真が手前に重なって浮いているカード」のように見える配置。
4. サブ写真には白または淡いピンクの細い縁取り（フチ）と、柔らかいドロップシャドウを付け、メイン写真の上に浮いていることが視覚的にはっきり分かるようにする。
5. 結果として、セクション全体のシルエットは「左に大きな正方形〜縦長の写真、右下に小さな写真が斜めではなく水平垂直のまま重なって覗いている」非対称なL字型・階段状のシルエットになる。中央に写真同士がぴったり接する1本の垂直な境界線ができる構図（＝2分割グリッド）には絶対にしない。

■ 禁止事項（厳守）:
・2枚の写真を同じ高さ・同じ幅比率の矩形として横に並べること（50:50でも60:40でも、単純に幅比率を変えただけの横並びグリッドは全て禁止）
・2枚の写真の間に、上下フルの1本の縦の境界線（隙間なく接する縦の切れ目）を作ること
・2枚の写真を上下にずらすだけで、矩形としての幅がほぼ同じままの配置にすること
`,
  "06-purchase-method": `
────────────────
【このセクション固有のPC構図指示（最優先）】
・スマホ版は見出し・本文・予約期間・注記を上から下へ中央揃えで一列に積んでいるが、PC版ではそのまま横に引き伸ばさない。
・見出しと本文説明を左カラム、予約期間と注記を右カラム（細い縦の区切り線または枠で囲ったコールアウト風のブロック）に配置する左右2カラム構成に組み替える。
`,
  "09-footer": `
────────────────
【このセクション固有のPC構図指示（最優先）】
・スマホ版はフッターリンク・ロゴマークを写真下部に中央揃えで縦に積んでいるが、PC版ではそのまま横に引き伸ばさない。
・フッター情報を「左にロゴマーク、右にリンク群を横一列」に並べる横長のフッターバー構成に組み替え、背景写真は片側に寄せるか上部帯に留める。
`,
};

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const specific = SECTION_SPECIFIC_INSTRUCTION[section.id] || "";
  const prompt = buildPrompt(section) + PC_MOBILE_FIRST_INSTRUCTION + specific;
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
