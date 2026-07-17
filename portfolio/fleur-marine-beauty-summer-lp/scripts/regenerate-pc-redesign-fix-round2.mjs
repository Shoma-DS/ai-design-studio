import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/fleur-marine-beauty-summer-lp");
const pcImageDir = path.join(projectRoot, "lp/images");
const mobileImageDir = path.join(pcImageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

// round2: 06と15はround1のPC再構成でも配置がスマホ版とほぼ同一のままだったため、
// より具体的な再構成指示を追加してもう一度作り直す。
const targetIds = new Set(["06-cta-reserve", "15-product-sunscreen"]);
const selected = sections.filter((s) => targetIds.has(s.id));

// 強化版プロンプト（skills/design/lp-responsive/SKILL.md「PC版をスマホ版基準で作り直す」より）
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
・上下端は前後セクションへ自然につながる余白で終える`;

// round2固有の追加指示：round1では「サイズ変更のみ」判定になった具体的な問題点を名指しして修正させる。
const EXTRA_INSTRUCTIONS = {
  "06-cta-reserve": `
────────────────
【このセクション特有の再構成指示（round2・厳守）】
前回生成したPC版は、ボタンが画面中央にそのまま配置され、装飾ハイビスカスの位置もスマホ版とほぼ同じ左下・右上の配置のままで、単に横幅を広げただけの「サイズ変更」になってしまっていた。今回は必ず次のように組み替えること。
・ボタンは画面の中央ではなく、コンテナ幅の中でやや左寄り（全体の左40%あたりを中心）に配置し、ボタンの右側に「8月末までの期間限定」のような短い一言コピーや、金色の星飾り・区切り線を横一列に添えて、ボタン単体ではなく「ボタン＋右側の一言コピー」という横方向の構成にする。
・ボタン自体のサイズは、スマホ版の相対的な大きさ（画面幅に対する比率）より小さめにし、余白を大きく取る。ボタンを画面幅いっぱいに引き伸ばさない。
・装飾ハイビスカスは左右対称の「左下＋右上」配置をやめ、右端に縦方向へ連なるように寄せる、または一枠に集約するなど、スマホ版と異なる非対称な配置にする。
・上下の罫線・星飾りは、ボタンの直上直下ではなく、コンテナの左右端まで伸びる横長の一本の帯として配置し直す。
・結果として「このPC画像から見出しかビジュアルのどちらかを取り除いても、スマホ版のスクリーンショットとほぼ同じシルエットに見えるか？」という自問に対してNoと言える構図にすること。`,
  "15-product-sunscreen": `
────────────────
【このセクション特有の再構成指示（round2・厳守）】
前回生成したPC版は、見出し→ボトル画像(左)+説明テキスト(右)の2カラム→アイコン2列×3行グリッド、という配置がスマホ版とほぼ同一のままで、単に横幅を広げただけの「サイズ変更」になってしまっていた。今回は必ず次のように組み替えること。
・上部の「見出し＋ボトル画像＋商品説明」ブロックは、ボトル画像を左カラムでスマホ版より大きく大胆に配置し、右カラムのテキスト幅は逆に狭くする（画像40%: テキスト60%ではなく、画像を主役にした比率、目安は画像45〜50%: テキスト50〜55%）など、スマホ版とは異なる列幅比率にする。商品名・SPF・価格の文字要素は縦積みのまま右カラムに置いてよいが、価格だけは右カラム下ではなく画像に近い位置（画像の右下に寄り添う形）へ移動するなど、要素の相対位置を変える。
・6つの特徴アイコン（毎日に寄り添う、うれしいポイント）は、スマホ版の「2列×3行」の縦長グリッドのまま使わない。PC版では「3列×2行」の横長グリッド、または「6個を横一列に並べる」構成に組み替え、グリッド全体を横方向に広げる。
・アイコングリッドの下のCTAボタン＋注記は、中央寄せのまま置いてよいが、ボタン幅はグリッドの全幅まで引き伸ばさず、中央にコンパクトに配置する。
・結果として、上部ブロックの列幅比率とアイコングリッドの列数の両方が、スマホ版と明確に異なる構成になっていること。`,
};

async function generateOne(section) {
  const outputPath = path.join(pcImageDir, section.imageName);
  const mobilePath = path.join(mobileImageDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate pc (redesign fix round2) ${section.id}: ${section.title}`);
  const extra = EXTRA_INSTRUCTIONS[section.id] || "";
  const generated = await generateImageWithCodexAppServer({
    prompt: buildPrompt(section) + PC_REDESIGN_INSTRUCTION + extra,
    sectionId: `${section.id}-pc-redesign-fix-round2`,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-mobile-reference.png`, buffer: mobileBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done pc ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

let index = 0;
const failures = [];
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 2), 5));

async function worker() {
  while (index < selected.length) {
    const section = selected[index++];
    try {
      await generateOne(section);
    } catch (error) {
      failures.push({ id: section.id, error });
      console.error(`fail pc ${section.id}:`, error?.message || error);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, () => worker()));

if (failures.length) {
  console.error(`${failures.length} pc redesign round2 tasks failed.`);
  process.exitCode = 1;
} else {
  console.log(`Regenerated ${selected.length} pc section images (round2).`);
}
