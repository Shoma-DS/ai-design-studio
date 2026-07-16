import fs from "node:fs/promises";
import path from "node:path";
import { generateImageWithCodexAppServer } from "/Users/yamamotorina/Documents/ai-design-studio/server/codexImageClient.mjs";

const REPO_ROOT = "/Users/yamamotorina/Documents/ai-design-studio";
const LP_DIR = path.join(REPO_ROOT, "portfolio/kurabiyori-miso-shop-lp/lp");

const items = [
  {
    id: "recipe-miso-soup",
    imageName: "recipe-miso-soup.png",
    prompt:
      "白背景の和食料理写真。木製のテーブルの上に、黒い漆塗りの椀に入った具沢山の味噌汁（豆腐とわかめと長ねぎ）を上から斜めのアングルで撮影。手前に木のお玉と少量の味噌がのった小皿を添える。柔らかい自然光、清潔感のある高級和食のプロダクト撮影トーン。文字やロゴは入れない。",
  },
  {
    id: "recipe-miso-glaze",
    imageName: "recipe-miso-glaze.png",
    prompt:
      "白背景の和食料理写真。艶やかな味噌だれをかけた焼き野菜（茄子の田楽）を白い角皿に美しく盛り付け、上から斜めのアングルで撮影。器のそばに味噌を塗るための小さな刷毛を添える。柔らかい自然光、清潔感のある高級和食のプロダクト撮影トーン。文字やロゴは入れない。",
  },
];

async function main() {
  for (const item of items) {
    console.log(`Generating ${item.id} ...`);
    const result = await generateImageWithCodexAppServer({
      prompt: item.prompt,
      sectionId: item.id,
      imageName: item.imageName,
      refImages: [{ path: path.join(LP_DIR, "images/06-series-products.png"), name: "06-series-products.png" }],
      cwd: REPO_ROOT,
      taskType: "section",
    });
    const outPath = path.join(LP_DIR, "images", item.imageName);
    await fs.writeFile(outPath, result.buffer);
    console.log(`Saved: ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
