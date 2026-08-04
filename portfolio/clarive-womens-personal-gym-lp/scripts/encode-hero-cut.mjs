// Premiereから書き出したマスターを、LP配信用に変換する
// 実行: node portfolio/clarive-womens-personal-gym-lp/scripts/encode-hero-cut.mjs
//
// マスター（ad/hero-cut-master.mp4）は無圧縮に近い19MB・PCM音声つきなので、
// ここで音声を落とし、H.264/VP9へ圧縮し、スマホ用の縦寄り構図を切り出す。

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const master = path.join(projectRoot, "ad/hero-cut-master.mp4");
const outDir = path.join(projectRoot, "lp/video");

function ff(args) {
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
}

if (!fs.existsSync(master)) {
  console.error(`マスターが見つかりません: ${master}`);
  process.exit(1);
}

// PC: 1920x1080 のまま。音声を落として圧縮
const pcMp4 = path.join(outDir, "hero-pc.mp4");
ff(["-i", master, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", pcMp4]);
ff(["-i", pcMp4, "-an", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0", "-row-mt", "1",
    path.join(outDir, "hero-pc.webm")]);

// SP: 人物がいる右側を 1080x1040（≒1:1）に切り出す
// 1920x1080 から 高さ1080・幅1122（=1080*1080/1040）を右寄りで取り、1080x1040へ縮小
const spMp4 = path.join(outDir, "hero-sp.mp4");
ff(["-i", master, "-an",
    "-vf", "crop=1122:1080:798:0,scale=1080:1040:flags=lanczos",
    "-c:v", "libx264", "-preset", "slow", "-crf", "24",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", spMp4]);
ff(["-i", spMp4, "-an", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0", "-row-mt", "1",
    path.join(outDir, "hero-sp.webm")]);

// ポスターは必ず各動画の先頭フレーム（別画像だと切り替わる瞬間に画が跳ねる）
for (const [src, name] of [[pcMp4, "hero-pc-poster.jpg"], [spMp4, "hero-sp-poster.jpg"]]) {
  ff(["-i", src, "-vf", "select=eq(n\\,0)", "-frames:v", "1", "-q:v", "4", path.join(outDir, name)]);
}

for (const n of ["hero-pc.mp4", "hero-pc.webm", "hero-pc-poster.jpg",
                 "hero-sp.mp4", "hero-sp.webm", "hero-sp-poster.jpg"]) {
  console.log(`${n}: ${(fs.statSync(path.join(outDir, n)).size / 1024).toFixed(0)}KB`);
}
