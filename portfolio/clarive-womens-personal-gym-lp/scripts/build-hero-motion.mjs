// ヒーロー「トレーニング動作」ループ動画の生成
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/build-hero-motion.mjs
//
// 方針:
//   lp/images/motion/motion-00〜07.png（ダンベルカール1レップの8コマ）を
//   オプティカルフロー補間（ffmpeg minterpolate）で滑らかに繋ぎ、
//   最後のコマから先頭コマへ戻すことで途切れないループにする。
//
//   8コマをそのまま並べるとパラパラ漫画になるため、
//   各コマを等間隔に置いた低フレームレートの素材を作り、
//   minterpolate で 30fps に motion-compensated 補間する。
//   これで「腕が連続的に動く」映像になる。

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const motionDir = path.join(projectRoot, "references/motion-frames");
const outDir = path.join(projectRoot, "lp/video");
const tmp = "/tmp/clarive-hero-motion";

const FPS = 30;
// 16コマ。素材6fps → 1レップ約2.7秒（実際のカール1レップの速さ）。
// コマ間は5フレーム分だけ補間すればよくなるため、腕のゴーストが出にくい。
const SRC_FPS = 6;
const IDS = [
  "00", "00b", "01", "01b", "02", "02b", "03", "03b",
  "04", "04b", "05", "05b", "06", "06b", "07", "07b",
];

function ff(args) {
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
}

fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

// 1) 連番を作る。末尾に先頭コマをもう一度置き、ループの戻りも補間対象にする
const missing = IDS.filter((id) => !fs.existsSync(path.join(motionDir, `motion-${id}.png`)));
if (missing.length) {
  console.error(`未生成のコマがあります: ${missing.join(", ")}`);
  process.exit(1);
}

const seq = [...IDS, "00"];
seq.forEach((id, i) => {
  fs.copyFileSync(
    path.join(motionDir, `motion-${id}.png`),
    path.join(tmp, `f${String(i).padStart(3, "0")}.png`)
  );
});

function build({ out, size, crop, crf }) {
  const vf = [];
  if (crop) vf.push(`crop=${crop}`);
  vf.push(`scale=${size}:flags=lanczos`);
  // オプティカルフロー補間: コマ間の腕の動きを埋めて連続動作にする
  vf.push(`minterpolate=fps=${FPS}:mi_mode=mci:mc_mode=aobmc:vsbmc=1:me_mode=bidir:me=epzs:search_param=64`);
  vf.push("format=yuv420p");

  const mp4 = path.join(outDir, `${out}.mp4`);
  ff([
    "-framerate", String(SRC_FPS),
    "-i", path.join(tmp, "f%03d.png"),
    "-vf", vf.join(","),
    "-an",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-movflags", "+faststart",
    "-r", String(FPS),
    mp4,
  ]);

  // 末尾に重複した先頭コマが1コマ分残るので取り除き、継ぎ目を自然にする
  const trimmed = path.join(tmp, `${out}-trim.mp4`);
  const total = (seq.length - 1) / SRC_FPS; // 戻りコマの表示分を除いた尺
  ff(["-i", mp4, "-t", total.toFixed(3), "-c", "copy", trimmed]);
  fs.copyFileSync(trimmed, mp4);

  const webm = path.join(outDir, `${out}.webm`);
  ff(["-i", mp4, "-an", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", webm]);

  const poster = path.join(outDir, `${out}-poster.jpg`);
  ff(["-i", mp4, "-vf", "select=eq(n\\,0)", "-frames:v", "1", "-q:v", "4", poster]);

  return { mp4, webm, poster };
}

// PC: 1920x1080（左55%はテキスト領域なので触らない）
const pc = build({ out: "hero-pc", size: "1920:1080", crop: null, crf: 22 });

// SP: 1080x1040。人物が入る右寄りを正方形に近く切り出す
// 素材は1672x941想定。人物は右45%にいるので、右側を中心に切る
const sp = build({
  out: "hero-sp",
  size: "1080:1040",
  crop: "in_h*1.038:in_h:in_w*0.52:0",
  crf: 22,
});

for (const [label, r] of [["PC", pc], ["SP", sp]]) {
  for (const f of [r.mp4, r.webm, r.poster]) {
    console.log(`${label} ${path.basename(f)}: ${(fs.statSync(f).size / 1024).toFixed(0)}KB`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
