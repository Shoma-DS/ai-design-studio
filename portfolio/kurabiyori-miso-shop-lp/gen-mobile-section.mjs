import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";
import { sections, buildPrompt } from "./sections.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const LP_DIR = path.join(REPO_ROOT, "portfolio/kurabiyori-miso-shop-lp/lp");
const MOBILE_DIR = path.join(LP_DIR, "images/mobile");

const MOBILE_DIRECTIVE = `
────────────────
【スマートフォン専用レイアウト再構成の指示（最優先・厳守）】
このセクションは実際にはPC版ではなく【スマートフォン縦画面専用】のセクション画像として出力する。
・添付する参照画像（同一セクションのPC/デスクトップ版）は配色・ブランド・コピー・トーン・情報の順序を踏襲するためだけに使う
・PC版で左右2カラムだった要素は、必ず縦1カラムに積み直す（左右に並べない）
・横並びのアイコン・カード・ボタンが3つ以上ある場合は、2列グリッドまたは縦積みに再構成する（横一列のままにしない）
・見出し・本文とも、スマートフォンで実寸表示した際に十分大きく読める文字サイズにする
・コピー・チェーン名・ブランド要素・配色はPC版と完全に同じに保つ
・750px幅のスマートフォン縦型LPセクションとして出力し、高さは内容に合わせて自然に調整する
・上下端は前後セクションへ自然につながる余白で終える`;

async function main() {
  const targetId = process.argv[2];
  const section = sections.find((s) => s.id === targetId);
  if (!section) throw new Error(`section not found: ${targetId}`);

  await fs.mkdir(MOBILE_DIR, { recursive: true });

  const prompt = buildPrompt(section) + MOBILE_DIRECTIVE;
  const desktopImagePath = path.join(LP_DIR, "images", section.imageName);

  console.log(`Generating mobile section image for ${section.id} ...`);
  const result = await generateImageWithCodexAppServer({
    prompt,
    sectionId: `mobile-${section.id}`,
    imageName: section.imageName,
    refImages: [{ path: desktopImagePath, name: section.imageName }],
    cwd: REPO_ROOT,
    taskType: "section",
  });

  const outPath = path.join(MOBILE_DIR, section.imageName);
  await fs.writeFile(outPath, result.buffer);
  console.log(`Saved: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
