// CLARIVE ヒーロー背景ループ動画の生成
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/build-hero-loops.mjs
//
// 設計:
// - 8秒(240フレーム)の「往復」ケンバーンズ。片道ズームだとループの先頭に戻る瞬間に画が飛ぶ。
// - イージングはレイズドコサイン（ハン窓） w(n) = 0.5 - 0.5*cos(2*PI*n/N)。
//   両端で速度がゼロになるため、折り返しとループの継ぎ目が同時に滑らかになる。
// - ズームだけだと動きに気づきにくいため、ベースズームを掛けた上で注視点を横に流し、
//   「寄りながら流れる」動きにしている（平行移動のほうが知覚されやすい）。
// - zoompanの整数量子化による階段状のガタつきを避けるため、事前にlanczosで拡大してから処理する。

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(projectRoot, "references/original-png");
const outDir = path.join(projectRoot, "lp/video");

const FPS = 30;
const FRAMES = 240; // 8秒

function ff(args) {
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
}

/** レイズドコサインの重み（0→1→0） */
const W = `(0.5-0.5*cos(2*PI*on/${FRAMES}))`;

function buildClip({ name, src, crop, upscale, out, zBase, zAmp, fx0, fxAmp, fy0, fyAmp, size, crf }) {
  const work = path.join("/tmp", `clarive-hero-${name}.png`);

  // 1) 必要ならクロップ → lanczosで拡大（zoompanのガタつき対策）
  const pre = [];
  if (crop) pre.push(`crop=${crop}`);
  pre.push(`scale=${upscale}:flags=lanczos`);
  ff(["-i", src, "-vf", pre.join(","), "-frames:v", "1", work]);

  // 2) 往復ケンバーンズ
  const z = `${zBase}+${zAmp}*${W}`;
  const fx = `${fx0}+${fxAmp}*${W}`;
  const fy = `${fy0}+${fyAmp}*${W}`;
  const zp = [
    `zoompan=z='${z}'`,
    `x='(iw-iw/zoom)*(${fx})'`,
    `y='(ih-ih/zoom)*(${fy})'`,
    `d=${FRAMES}`,
    `s=${size}`,
    `fps=${FPS}`,
  ].join(":");

  const mp4 = path.join(outDir, `${out}.mp4`);
  ff([
    "-loop", "1", "-i", work,
    "-vf", `${zp},format=yuv420p`,
    "-frames:v", String(FRAMES),
    "-an",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-movflags", "+faststart",
    "-r", String(FPS),
    mp4,
  ]);

  const webm = path.join(outDir, `${out}.webm`);
  ff(["-i", mp4, "-an", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", webm]);

  const poster = path.join(outDir, `${out}-poster.jpg`);
  ff(["-i", mp4, "-vf", "select=eq(n\\,0)", "-frames:v", "1", "-q:v", "4", poster]);

  fs.unlinkSync(work);
  return { mp4, webm, poster };
}

// ---- PC: 1920x1080。左55%は見出し・CTAが重なる無地の壁のまま保つ ----
// 注視点を右（人物側）へ流すことで、左のテキスト領域には壁だけが残る。
const pc = buildClip({
  name: "pc",
  src: path.join(srcDir, "01-hero.png"),
  crop: null,
  upscale: "3840:2160",
  out: "hero-pc",
  zBase: 1.06, zAmp: 0.085,
  fx0: 0.54, fxAmp: 0.30,
  fy0: 0.46, fyAmp: 0.06,
  size: "1920x1080",
  crf: 23,
});

// ---- SP: 1080x1040。人物の顔を軸に寄る ----
// 元画像(941x1672)は上60%が壁なので、人物が入る下側を先に切り出す。
const sp = buildClip({
  name: "sp",
  src: path.join(srcDir, "mobile/01-hero.png"),
  crop: "941:906:0:700",
  upscale: "2823:2718",
  out: "hero-sp",
  zBase: 1.05, zAmp: 0.09,
  fx0: 0.50, fxAmp: 0.10,
  fy0: 0.34, fyAmp: 0.12,
  size: "1080x1040",
  crf: 23,
});

for (const [label, r] of [["PC", pc], ["SP", sp]]) {
  for (const f of [r.mp4, r.webm, r.poster]) {
    console.log(`${label} ${path.basename(f)}: ${(fs.statSync(f).size / 1024).toFixed(0)}KB`);
  }
}
