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

// 強化版プロンプト: skills/design/lp-responsive/SKILL.md「PC版をスマホ版基準で作り直す」節
const PC_REDESIGN_INSTRUCTION = `
────────────────
【PC版レイアウト再構成の指示（最優先・厳守）】
このセクションは【PC/デスクトップ表示専用のセクション画像、max-width 1200pxのコンテナに中央配置される】として出力する。
・添付する参照画像（同一セクションのスマホ版）のコピー・ブランド要素・配色・情報量・視線導線の「世界観」は踏襲するが、要素の配置（レイアウト構造）はスマホ版のまま流用しない。PCの横幅を使って組み替えること。
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

// 17-coupon: 現行PC版はスマホ版と同じ2x2グリッドを縮小しただけ（NG）。
// 4つの特典カードを横一列（1x4）に組み替える。
const LAYOUT_OVERRIDES = {
  "17-coupon": `
・具体的な組み替え: 上部の「Campaign／今だけの特典」見出しと装飾写真、ピンクのクーポン帯（はじめての方にうれしい特典／美肌ケア脱毛をお得に体験）は、そのまま全幅で上部に配置する（横幅が広がった分、自然に横長に伸ばしてよい）。
  その直下、特典01〜特典04の4枚のカードは、スマホ版の2x2グリッドのまま縮小するのではなく、必ず横一列の4カラム（1x4グリッド）に並べ替える。各カードは同じ高さの縦長カードとし、上から順に「特典ラベル（特典01〜04）」「丸アイコン」「見出しコピー」「説明文」を縦に積んだ構成にする。
  4カード横一列の下に、初めての方も安心のサポート体制（4つの小アイコン：丁寧なカウンセリング／プライバシーに配慮した空間／お肌に合わせたやさしいケア／無理のない通いやすいプラン）を、女性の写真と組み合わせて横並びで配置する。
  その下に「ご利用にあたって」の注釈ボックスを全幅で配置し、最後にCTAボタン（Webで予約する）を全幅中央に配置する。
  全体としてスマホ版の2x2グリッドのシルエットが残らないようにすること（4枚のカードが縦に2段重なって見える構図はNG）。`,
};

const targetIds = new Set(Object.keys(LAYOUT_OVERRIDES));

const argIds = new Set(process.argv.slice(2));
const selected = sections.filter((s) => (argIds.size ? argIds.has(s.id) : targetIds.has(s.id)));

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  const mobilePath = path.join(mobileDir, section.imageName);
  const mobileBuffer = await fs.readFile(mobilePath);
  console.log(`generate ${section.id}: ${section.title}`);
  const override = LAYOUT_OVERRIDES[section.id] || "";
  const prompt = buildPrompt(section) + PC_REDESIGN_INSTRUCTION + override;
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
  const outTmp = `${outputPath}.new.png`;
  await fs.writeFile(outTmp, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outTmp)}`);
  return { id: section.id, path: outTmp };
}

async function runPool(items, concurrency, worker) {
  const results = [];
  let idx = 0;
  async function next() {
    while (idx < items.length) {
      const current = idx++;
      try {
        results[current] = { ok: true, value: await worker(items[current]) };
      } catch (error) {
        results[current] = { ok: false, error };
        console.error(`FAILED ${items[current].id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => next());
  await Promise.all(workers);
  return results;
}

const CONCURRENCY = Number(process.env.GEN_CONCURRENCY || 4);
const results = await runPool(selected, CONCURRENCY, generateOne);

const okCount = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
console.log(`Generated ${okCount}/${selected.length} sections.`);
if (failed.length) {
  console.log(`Failed: ${failed.map((_, i) => selected[i]?.id).filter(Boolean).join(", ")}`);
  process.exitCode = 1;
}
