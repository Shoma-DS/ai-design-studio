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

// round3: round2でも06-cta-reserveはPC/スマホの縦横比が1.82/1.77とほぼ同一のままで、
// 「ボタン＋右側の短いコピー」までは組み替えたが、まだ中央寄りの単純構成の域を出ていなかった。
// 今回は、目標レイアウトを座標イメージレベルまで具体化して再生成する。
const targetIds = new Set(["06-cta-reserve"]);
const selected = sections.filter((s) => targetIds.has(s.id));

const PC_REDESIGN_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する参照画像（同一セクションのスマホ版）のコピー・ブランド要素・配色・情報量・視線導線の「世界観」は踏襲するが、**要素の配置（レイアウト構造）はスマホ版のまま流用しない。PCの横幅を使って組み替えること。**
・単に用紙のサイズ・余白比率だけを変えて「スマホ版と同じ配置のまま少し横に広い版」を作ることは禁止。それは「作り直し」ではなく「サイズ変更」であり、この指示の目的に反する。
・コピー・ブランド要素・配色はスマホ版と完全に同じに保つ（情報を削らない）。
・上下端は前後セクションへ自然につながる余白で終える。`;

const EXTRA_INSTRUCTIONS = {
  "06-cta-reserve": `
────────────────
【このセクション特有の再構成指示（round3・最優先・座標レベルで厳守）】
過去2回のPC版生成は、ボタンをほぼ画面中央に置いたまま横幅だけを広げた構成になっており、スマホ版と縦横比までほぼ同じ（PC比率1.82・スマホ比率1.77）になってしまっていた。今回は必ず次の具体的な座標イメージ通りに配置すること。中央配置のボタン単体レイアウトは完全に禁止する。

■ 横方向の3ブロック構成（画像全体を横100%とした目安の位置）
1. 左ブロック（横0%〜55%の範囲、視覚的な中心は横27%あたり）:
   コーラルピンクの角丸ピル型CTAボタン「コルギを予約する ▶」を、この左ブロックの中に配置する。ボタンの左端は画像左端から余白を取って始まり、右端は画像の横方向中心（50%）よりはっきり手前（45%あたり）で止める。ボタンは画像横幅いっぱいに引き伸ばさない。

2. 中央の縦仕切り（横55%〜60%あたり）:
   細い縦の罫線または金の星飾りを1本、天地に長く配置し、左ブロックと右ブロックを視覚的に分ける。

3. 右ブロック（横60%〜100%の範囲）:
   アイコン（時計・タイマー・チェックマークなど「手早く完了する」印象のシンプルな線画アイコンを1つ）を上に置き、その下に短い一言コピー「予約はカンタン30秒」を1〜2行で配置する。文字サイズはCTAボタンの文言より小さくてよいが、余白の中で視認できる大きさにする。右ブロックの内容はボタンより幅が狭く、縦にコンパクトにまとまった構成にする。

■ 装飾ハイビスカスの非対称配置
・スマホ版にある「左下＋右上」の対角対称配置は使わない。
・PC版では、装飾ハイビスカスと葉を画像の右端に寄せ、右ブロック（アイコン＋一言コピー）の背景から右端にかけて縦に連なるクラスターとして1箇所にまとめる。画像の左半分・左下には大きな花を置かない（左ブロックは花のないクリーンな背景にする）。
・結果として、左右で装飾密度がはっきり異なる非対称な構図にする。

■ 罫線・星飾り
・上下の細い罫線・星飾りは、ボタン直上直下ではなく画像の左右端まで届く横長の帯として、画像全体の上部・下部に通す。

■ 完成後の自己チェック（このプロンプトを守れているかの最終確認）
「このPC画像からコピーだけを消して、ボタンと装飾の位置関係だけを見たとき、ボタンが画面中央に見えるか？」→ 中央に見えたら失敗。ボタンは明確に画面の左寄りに見えなければならない。
「装飾ハイビスカスの配置は、スマホ版と同じ対角対称（左下＋右上）に見えるか？」→ 見えたら失敗。右側1箇所に集約された非対称配置でなければならない。
「右ブロックのアイコン＋一言コピーは実在しているか？」→ 存在しなければ失敗。`,
};

async function generateOne(section) {
  const outputPath = path.join(pcImageDir, section.imageName);
  const mobilePath = path.join(mobileImageDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate pc (redesign fix round3) ${section.id}: ${section.title}`);
  const extra = EXTRA_INSTRUCTIONS[section.id] || "";
  const generated = await generateImageWithCodexAppServer({
    prompt: buildPrompt(section) + PC_REDESIGN_INSTRUCTION + extra,
    sectionId: `${section.id}-pc-redesign-fix-round3`,
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
const concurrency = 1;

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
  console.error(`${failures.length} pc redesign round3 tasks failed.`);
  process.exitCode = 1;
} else {
  console.log(`Regenerated ${selected.length} pc section images (round3).`);
}
