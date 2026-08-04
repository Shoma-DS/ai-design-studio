// ビフォーアフター比較の「Before」を作り直す
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/regenerate-before.mjs [id...] [--force]
//
// 狙い:
//   既存のBeforeはAfterとの差が小さく、スライダーを動かしても変化が読み取れなかった。
//   そこで **Afterを参照画像に渡して** Beforeを作り直し、
//   「同一人物・同一ポーズ・同一背景・同一カメラで、体型だけが違う」状態を作る。
//
// 注意:
//   差は「2ヶ月で−7kg相当」の現実的な範囲にとどめる。
//   誇張した体型差は景品表示法上のリスクになるうえ、かえって嘘っぽく見える。

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../../server/codexImageClient.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/clarive-womens-personal-gym-lp");
const srcDir = path.join(projectRoot, "references/original-png");

const RULES = `
【最重要ルール】
・画像内に文字・ロゴ・数字・記号・透かしを一切入れない
・実在企業のロゴ・商標・実在人物の顔を再現しない
・指の本数・関節の向きが破綻しないこと
・体型を戯画化しない。太らせすぎず、健康的な範囲の「引き締まる前の体」にとどめる
`;

const LOCK = `
【添付画像との関係（最重要）】
添付画像は、同一人物を**2ヶ月後に同じ条件で撮影した記録写真（After）**である。
これから出力するのは、その**2ヶ月前に撮った1枚目（Before）**。

完全に一致させるもの:
・顔立ち・髪型・髪の長さと色
・スポーツブラとボトムスの色・形・素材
・背景（壁、床、什器、小物）と、その配置
・照明の向き・強さ・色温度・影の落ち方
・カメラの高さ・画角・距離
・立ち位置（画面内の左右位置）と、頭頂から足元までが画面に占める高さ
・ポーズ（正面を向いて直立、腕は体の脇に自然に下ろす）と表情の方向性

変えるもの（ここだけ）:
・体型。2ヶ月のプログラムを始める前の状態にする
`;

const BODY_BEFORE = `
【Beforeの体型】
2ヶ月で7kg落とす前の体。次の点が、添付のAfterと明確に違うと分かるようにする。
・ウエストのくびれが浅く、下腹部にやわらかい丸みがある
・脇腹に自然な厚みがある
・二の腕がやわらかく、輪郭がはっきりしない
・太ももに厚みがあり、脚のラインが直線的
・全体に、鍛えた筋肉の陰影が出ていない

ただし、肥満体型にはしない。標準よりやや丸みがある一般的な体型の範囲。
表情は控えめな微笑みのままで、暗い顔・恥じている顔にはしない。
`;

const TONE = `
【色・雰囲気ルール】
・添付画像とまったく同じトーン。中〜低彩度、穏やかなコントラスト
・肌は自然な日本人の肌色。過度な美白補正やプラスチックのような質感にしない
・均一なスタジオ照明で、強い影を作らない
・実際のカメラマンが撮影した記録写真の質感。イラスト・3DCG・アニメ調にしない
`;

const TARGETS = [
  {
    id: "before-a",
    ref: "14-after-a.png",
    out: "13-before-a.png",
    subject:
      "30代前半の日本人女性が1人、チャコールグレーの無地のスポーツブラとショートパンツ姿で、無地のウォームベージュの壁の前に正面を向いて直立している。髪は肩にかかるセミロングの黒髪。腕は体の脇に自然に下ろす。",
  },
  {
    id: "before-b",
    ref: "16-after-b.png",
    out: "15-before-b.png",
    subject:
      "40代前半の日本人女性が1人、ダークネイビーの無地のスポーツブラとレギンス姿で、ウォームベージュの壁とライトオークの床の部屋に正面を向いて直立している。髪はショートボブ。腕は体の脇に自然に下ろす。背景左手にパンパスグラスを生けた花器、右手に木製のベンチ。",
  },
];

function buildPrompt(t) {
  return `あなたは【トップクラスの記録写真フォトグラファー】です。
目的：パーソナルジムのビフォーアフター比較に使う「Before」の1枚。添付のAfterと縦に切り替えて比較するため、体型以外は完全に一致していなければならない。
────────────────
【入力】
@img（参照画像：添付あり＝同一人物のAfter）
${RULES}${LOCK}
【被写体】
${t.subject}
${BODY_BEFORE}${TONE}
【出力条件】
・縦長3:4（1086×1448px相当）
・添付画像と並べて縦に切り替えたとき、肩の位置・ブラの高さ・腰の高さ・足元の位置がぴったり重なること
・体のシルエットだけが変わって見えること

【最終目的】
2枚を左右にワイプして見比べたとき、「同じ人が同じ場所で撮った、2ヶ月前と後の写真」だと一目で分かること。`;
}

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const wanted = new Set(argv.filter((a) => !a.startsWith("--")));
const targets = wanted.size ? TARGETS.filter((t) => wanted.has(t.id)) : TARGETS;

const failed = [];
for (const t of targets) {
  const outPath = path.join(srcDir, t.out);
  if (!force) {
    try { await fs.access(outPath); console.log(`skip   ${t.id}`); continue; } catch { /* 未生成 */ }
  }
  const refBuffer = await fs.readFile(path.join(srcDir, t.ref));
  const started = Date.now();
  console.log(`gen    ${t.id} (ref: ${t.ref})`);
  try {
    const result = await generateImageWithCodexAppServer({
      prompt: buildPrompt(t),
      sectionId: t.id,
      imageName: t.out,
      refImages: [{ name: `after-reference.png`, buffer: refBuffer }],
      cwd: repoRoot,
      taskType: "showcase",
    });
    if (!result.configured) throw new Error(result.message || "Codex app-server is not configured.");
    if (!result.buffer) throw new Error("No image buffer returned.");
    await fs.writeFile(outPath, result.buffer);
    console.log(`done   ${t.id} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  } catch (err) {
    failed.push({ id: t.id, message: err?.message || String(err) });
    console.error(`FAIL   ${t.id}: ${err?.message || err}`);
  }
}

console.log(`\n=== ${targets.length - failed.length}/${targets.length} generated ===`);
for (const f of failed) console.log(`  FAILED ${f.id}: ${f.message}`);
if (failed.length) process.exitCode = 1;
