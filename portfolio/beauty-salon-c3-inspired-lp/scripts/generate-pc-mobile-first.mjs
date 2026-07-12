import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/beauty-salon-c3-inspired-lp");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");
const codexHome = process.env.CODEX_HOME || process.env.LP_CODEX_HOME;
if (codexHome) process.env.CODEX_HOME = codexHome;

const PC_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する参照画像（同一セクションのスマホ版）の情報設計・要素の並び順・余白のリズム・視線導線・アイコンや挿絵のスタイルを踏襲する
・スマホ版を単純に横へ引き伸ばした横長バナーにはしない。縦横比は16:9などに固定せず、このセクションの内容量に合った自然な高さにする（テキスト中心ならポートレートに近いままでよい。実際に比較・並列させる内容がある場合だけ横に広げる）
・コピー・ブランド要素・配色・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない）
・1200px幅で表示したときに間延びせず、スマホ版と一貫した世界観に見える構図にする
・上下端は前後セクションへ自然につながる余白で終える`;

const wantedIds = new Set(process.argv.slice(2));
const targets = sections.filter((s) => wantedIds.size === 0 || wantedIds.has(s.id));
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 3), 8));

async function generateOne(section) {
  const pngName = section.imageName;
  const mobileRef = path.join(mobileDir, pngName);
  const outPath = path.join(imageDir, pngName);

  console.log(`generate ${section.id} -> ${pngName}`);
  const refBuffer = await fs.readFile(mobileRef);
  const generated = await generateImageWithCodexAppServer({
    prompt: buildPrompt(section) + PC_INSTRUCTION,
    sectionId: section.id,
    imageName: pngName,
    refImages: [{ name: `${section.id}-mobile-reference.png`, buffer: refBuffer }],
    cwd: repoRoot,
    taskType: "section",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outPath, generated.buffer);
  console.log(`done ${section.id}`);
}

let index = 0;
const failures = [];
async function worker() {
  while (index < targets.length) {
    const section = targets[index++];
    try {
      await generateOne(section);
    } catch (error) {
      failures.push({ id: section.id, error });
      console.error(`fail ${section.id}:`, error?.message || error);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, () => worker()));

if (failures.length) {
  console.error(`${failures.length} sections failed: ${failures.map((f) => f.id).join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`Generated ${targets.length} PC sections.`);
}
