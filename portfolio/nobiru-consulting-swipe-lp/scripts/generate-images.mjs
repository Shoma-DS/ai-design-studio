import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/nobiru-consulting-swipe-lp");
const imageDir = path.join(projectRoot, "lp/images");

const commonRules = `【重要・アスペクト比】縦長ポートレート写真。画像サイズは幅1080px×高さ1920px（width < height、9:16の縦長）で出力すること。
横長（landscape）やほぼ正方形の構図は禁止。スマホを縦に持った画面いっぱいに収まる、上下方向に長い構図にする。
被写体（人物）はテーブルを挟んで横一列に広く並べるのではなく、画面の上下方向にバランスよく収まるように、カメラを寄せる／立ち位置を工夫するなどして縦構図に収める。
写真（実写風）のみで、文字・ロゴ・グラフィック装飾・キャプションは一切焼き込まない（テキストは後からHTMLで重ねるため）。
商標・実在人物・実在ブランドの模写は禁止、完全にオリジナルの人物・空間として生成する。広告然としすぎない自然な写真のトーン。`;

const sections = [
  {
    id: "01-hook",
    imageName: "01-hook.png",
    prompt: `${commonRules}
明るい自然光の入るオフィスミーティングスペースで、40代の中小企業経営者らしき人物と、資料を持ったコンサルタントが、テーブルを挟んで前向きな表情で話し合っている様子。信頼感のある落ち着いたブルー〜ホワイト基調の内装。画面下部1/3は人物の下半身・背景がシンプルになるよう構成し、見出しテキストを重ねても読みやすい余白を作る。`,
  },
  {
    id: "02-achievement",
    imageName: "02-achievement.png",
    prompt: `${commonRules}
オフィスでタブレットや資料を持ち、自信に満ちた表情で微笑む30代の女性コンサルタント。背景はやや明るいブルーのグラデーションがかったオフィス、開放的な窓からの光。画面下部1/3はシンプルな背景でコントラストを作り、見出し・数字テキストを重ねられるようにする。`,
  },
  {
    id: "03-concern",
    imageName: "03-concern.png",
    prompt: `${commonRules}
オフィスや店舗のバックヤードらしき空間で、40代〜50代の男女2人の中小企業経営者が、書類やノートパソコンを前に困った表情で考え込んでいるシーン。全体的にトーンを落とした、やや暗め・落ち着いた色調（ネイビー〜グレー基調）。画面上部・下部に見出しとチェックリストを重ねる余白を意識する。`,
  },
  {
    id: "04-solution",
    imageName: "04-solution.png",
    prompt: `${commonRules}
明るく整頓されたオフィスデスクで、資料やグラフ、ノートパソコンを前に、コンサルタントらしき人物が説明・確認をしている様子。白基調の清潔感あるオフィス、自然光。体系立った印象を与える整然とした構図。下部にサービス一覧を重ねる余白を意識する。`,
  },
  {
    id: "05-testimonial-1",
    imageName: "05-testimonial-1.png",
    prompt: `${commonRules}
40代男性、清潔感のあるシェフコートまたはカジュアルなビジネスカジュアル姿で、明るい飲食店の店内を背景に自然な笑顔でこちらを見ている、上半身のポートレート写真。`,
  },
  {
    id: "06-testimonial-2",
    imageName: "06-testimonial-2.png",
    prompt: `${commonRules}
50代男性、作業着の上にジャケットを羽織ったような小規模工場の経営者らしき人物が、工場や倉庫を背景に落ち着いた自信のある表情でこちらを見ている、上半身のポートレート写真。`,
  },
  {
    id: "07-representative",
    imageName: "07-representative.png",
    prompt: `${commonRules}
オフィスを背景に、40代男性のコンサルタント代表が、スーツ姿で腕を組み、誠実で自信のある表情でこちらを見ている縦型ポートレート。背景はやや暗めのオフィス（窓の外の景色がぼんやり見える）、被写体にライトが当たり際立つ構図。画面左側または上部に見出しテキストを重ねる余白を意識する。`,
  },
  {
    id: "08-final-cta",
    imageName: "08-final-cta.png",
    prompt: `${commonRules}
明るいオフィスで、経営者とコンサルタントが握手をしている、または晴れやかな表情で資料を見ながら話している前向きなシーン。画面全体に温かみのある光（オレンジ〜ブルーの自然光ミックス）。画面下部に見出しとCTAボタンを重ねる余白を意識する。`,
  },
];

const wantedIds = new Set(process.argv.slice(2));
const selected = wantedIds.size ? sections.filter((section) => wantedIds.has(section.id)) : sections;
const concurrency = Math.max(1, Math.min(Number(process.env.LP_IMAGE_CONCURRENCY || 3), 6));

await fs.mkdir(imageDir, { recursive: true });

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(section) {
  const outputPath = path.join(imageDir, section.imageName);
  if (await exists(outputPath)) {
    console.log(`skip ${section.id}: ${path.relative(repoRoot, outputPath)}`);
    return;
  }

  console.log(`generate ${section.id}`);
  const generated = await generateImageWithCodexAppServer({
    prompt: section.prompt,
    sectionId: section.id,
    imageName: section.imageName,
    refImages: [],
    cwd: repoRoot,
    taskType: "showcase",
  });

  if (!generated.configured) {
    throw new Error(generated.message || "Codex app-server image generation is not configured.");
  }
  await fs.writeFile(outputPath, generated.buffer);
  console.log(`done ${section.id}: ${path.relative(repoRoot, outputPath)}`);
}

let index = 0;
const failures = [];

async function worker() {
  while (index < selected.length) {
    const section = selected[index++];
    try {
      await generateOne(section);
    } catch (error) {
      failures.push({ id: section.id, error });
      console.error(`fail ${section.id}:`, error?.message || error);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, () => worker()));

if (failures.length) {
  console.error(`${failures.length} image generation tasks failed.`);
  process.exitCode = 1;
} else {
  console.log(`Generated ${selected.length} requested images.`);
}
