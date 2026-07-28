import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";
import { sections, buildPrompt } from "../sections.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "../..");
const imageDir = path.join(projectRoot, "lp/images");
const mobileDir = path.join(imageDir, "mobile");

const PC_MOBILE_FIRST_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する参照画像（同一セクションのスマホ版）の情報設計・要素の並び順・余白のリズム・視線導線・アイコンや挿絵のスタイルを踏襲する
・スマホ版を単純に横へ引き伸ばした横長バナーにはしない。見出しが写真/イラストの上にあるならPCでは横に並べる、カードが縦積み・2列グリッドならPCでは横一列または3列以上のグリッドに組み替える
・コピー・ブランド要素・配色・情報量はスマホ版と完全に同じに保つ（情報を削らない・足さない・スマホ版にない訴求や特典を新しく追加しない）
・縦横比は16:9前後の横長を基本にする（横1536×縦1024px程度）。内容量が極端に多いセクションのみ、多少縦に伸びることを許容する
・1200px幅で表示したときに間延びせず、スマホ版と一貫した世界観に見える構図にする
・上下端は前後セクションへ自然につながる余白で終える
`;

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((s) => wantedIds.has(s.id)) : sections;

await fs.mkdir(imageDir, { recursive: true });

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  if (await exists(outputPath)) {
    console.log(`skip ${section.id}: already exists`);
    return;
  }
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate pc ${section.id}: ${section.title}`);
  const prompt = buildPrompt(section) + PC_MOBILE_FIRST_INSTRUCTION;
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
  console.log(`done pc ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

for (const section of selected) {
  await generateOne(section);
}
console.log(`Generated ${selected.length} PC sections.`);
