import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/sunshine-berry-uv-care-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const section = {
  id: "03-ribbon",
  imageName: "03-ribbon.png",
  copy: ["外での時間を、もっと自由に楽しみたいあなたへ"],
};

const prompt = [
  "セクション: 03-ribbon（帯バナー）— スマートフォン専用モバイル版の作り直し",
  "",
  "LPコピー:",
  `・${section.copy[0]}`,
  "",
  "現状の問題:",
  "添付する参照画像（現行モバイル版）は、横長のワイドなリボンバナーが画面いっぱいに広がる構図になっており、実際には750px幅のスマートフォン縦画面には収まらない誤った状態である。今回はこれを、正しいスマートフォン縦画面用の縦長ポートレート画像として完全に作り直す。",
  "",
  "────────────────",
  "【スマートフォン専用レイアウトの指示（最優先・厳守）】",
  "このセクションは【スマートフォン縦画面専用】のセクション画像として出力する。",
  "・キャンバスは750px幅の縦長ポートレートとする（横長にしない）。高さは内容に合わせて自然に調整し、上下は前後セクション（白背景）へ自然につながる余白で終える。",
  "・青緑〜黄色のグラデーションが入った旗（リボン）型バナーを、縦画面の水平方向中央・垂直方向中央に配置する。バナー自体の帯の向きは横向きのままでよいが、バナーの左右がキャンバス幅からはみ出さず、左右に十分な余白を残すこと。",
  "・見出しコピーは自然に2行へ改行し、スマートフォンで実寸表示した際に十分大きく、はっきり読める文字サイズにする（1行に詰め込みすぎない）。例: 「外での時間を、」／「もっと自由に楽しみたいあなたへ」のように2行で収める。",
  "・花・葉の水彩装飾やグラデーションの飛沫は、リボンバナーの上側と下側に縦方向に配置する（現状のような左右対称の横広がりの配置にしない）。",
  "・シンプルで余白の多い構成を保つ。新しい要素（商品写真等）は追加しない。",
  "・上下端は前後セクションへ自然につながる余白で終える。",
  "・添付する参照画像（現行モバイル版）から、配色（青緑〜黄色のグラデーション、白文字）とブランドトーン・コピーは完全に引き継ぐ。ただし、そのレイアウト（横長ワイド配置）は絶対に踏襲しない。",
].join("\n");

async function generateOne() {
  const refPath = path.join(mobileDir, section.imageName);
  const refBuffer = await fs.readFile(refPath);
  console.log(`generate mobile/${section.id}`);

  const generated = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `mobile-fix-${section.id}`,
    imageName: section.imageName,
    refImages: [{ name: `${section.id}-mobile-current-reference.png`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  const outPath = path.join(mobileDir, section.imageName);
  await fs.writeFile(outPath, generated.buffer);
  console.log(`done mobile/${section.id} -> ${outPath}`);
}

try {
  await generateOne();
} catch (error) {
  console.error(`fail mobile/${section.id}:`, error?.message || error);
  process.exitCode = 1;
}
