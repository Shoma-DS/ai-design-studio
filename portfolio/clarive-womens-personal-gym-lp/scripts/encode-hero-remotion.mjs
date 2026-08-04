// Remotionで書き出したヒーロー背景を、LP配信用に変換する
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/encode-hero-remotion.mjs
//
// 元: projects/remotion-sandbox/out/clarive-hero-{pc,sp}.mp4
// 出力: lp/video/hero-{pc,sp}.{mp4,webm} と各ポスター
//
// ポスターは必ず動画の先頭フレームにする。別画像を使うと、
// LPでポスター→動画に切り替わる瞬間に構図が跳ねる。

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "../..");
const srcDir = path.join(repoRoot, "projects/remotion-sandbox/out");
const outDir = path.join(projectRoot, "lp/video");

function ff(args) {
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
}

const jobs = [
  { src: "clarive-hero-pc.mp4", out: "hero-pc", crf: 24, webmCrf: 38 },
  { src: "clarive-hero-sp.mp4", out: "hero-sp", crf: 24, webmCrf: 38 },
];

for (const job of jobs) {
  const src = path.join(srcDir, job.src);
  if (!fs.existsSync(src)) {
    console.error(`素材が見つかりません: ${src}`);
    process.exit(1);
  }
  const mp4 = path.join(outDir, `${job.out}.mp4`);
  ff(["-i", src, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(job.crf),
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  ff(["-i", mp4, "-an", "-c:v", "libvpx-vp9", "-crf", String(job.webmCrf), "-b:v", "0",
      "-row-mt", "1", path.join(outDir, `${job.out}.webm`)]);
  ff(["-i", mp4, "-vf", "select=eq(n\\,0)", "-vsync", "0", "-frames:v", "1", "-q:v", "4",
      path.join(outDir, `${job.out}-poster.jpg`)]);
}

for (const n of ["hero-pc.mp4", "hero-pc.webm", "hero-pc-poster.jpg",
                 "hero-sp.mp4", "hero-sp.webm", "hero-sp-poster.jpg"]) {
  console.log(`${n}: ${(fs.statSync(path.join(outDir, n)).size / 1024).toFixed(0)}KB`);
}
