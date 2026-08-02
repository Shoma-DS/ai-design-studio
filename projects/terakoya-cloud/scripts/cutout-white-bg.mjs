/**
 * 白背景で生成したキャラクターイラストを、背景の白だけ透過させたPNGへ変換する。
 *
 * mix-blend-mode に頼ると、親要素（framer-motion の filter など）が合成コンテキストを
 * 作った瞬間に破綻するため、画像側で透過を持たせる。
 *
 * 単純な明るさしきい値だと「白いシャツ」まで抜けてしまうので、
 * 画像の縁から連結している白領域だけをフラッドフィルで塗り潰す。
 * 輪郭線で囲まれた内側の白（シャツ・白目など）は塗り潰しが到達しないため残る。
 *
 * 使い方: node scripts/cutout-white-bg.mjs <入力> <出力png>
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [inputArg, outputArg] = process.argv.slice(2);

if (!inputArg || !outputArg) {
  console.error("usage: node scripts/cutout-white-bg.mjs <input> <output.png>");
  process.exit(1);
}

const inputPath = path.resolve(projectRoot, inputArg);
const outputPath = path.resolve(projectRoot, outputArg);

// 背景とみなす明るさの下限。これより暗い画素にはフラッドフィルを広げない（＝輪郭線で止まる）。
const BACKGROUND_MIN_BRIGHTNESS = 236;
// 完全に不透明にする明るさ。境界部分はこの間で線形に補間してジャギーを抑える。
const FULLY_OPAQUE_BELOW = 218;
// 色が付いている画素は被写体とみなして塗り潰さない。
const MAX_BACKGROUND_SATURATION = 16;

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const at = (x, y) => (y * width + x) * channels;

function isBackgroundish(x, y) {
  const i = at(x, y);
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const brightness = Math.min(r, g, b);
  const saturation = Math.max(r, g, b) - brightness;
  return brightness >= BACKGROUND_MIN_BRIGHTNESS && saturation <= MAX_BACKGROUND_SATURATION;
}

// 縁を種にしたフラッドフィル（4近傍）。visited は背景と判定された画素。
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let head = 0;
let tail = 0;

function push(x, y) {
  const key = y * width + x;
  if (visited[key]) return;
  if (!isBackgroundish(x, y)) return;
  visited[key] = 1;
  queue[tail++] = key;
}

for (let x = 0; x < width; x++) {
  push(x, 0);
  push(x, height - 1);
}
for (let y = 0; y < height; y++) {
  push(0, y);
  push(width - 1, y);
}

while (head < tail) {
  const key = queue[head++];
  const x = key % width;
  const y = (key - x) / width;
  if (x > 0) push(x - 1, y);
  if (x < width - 1) push(x + 1, y);
  if (y > 0) push(x, y - 1);
  if (y < height - 1) push(x, y + 1);
}

// 背景と判定された画素を透過させる。輪郭のすぐ外側は明るさに応じて半透明にする。
let clearedCount = 0;
for (let key = 0; key < width * height; key++) {
  if (!visited[key]) continue;
  const i = key * channels;
  const brightness = Math.min(data[i], data[i + 1], data[i + 2]);

  let alpha;
  if (brightness >= BACKGROUND_MIN_BRIGHTNESS + 10) {
    alpha = 0;
  } else if (brightness <= FULLY_OPAQUE_BELOW) {
    alpha = 255;
  } else {
    const t = (brightness - FULLY_OPAQUE_BELOW) / (BACKGROUND_MIN_BRIGHTNESS + 10 - FULLY_OPAQUE_BELOW);
    alpha = Math.round(255 * (1 - t));
  }

  data[i + 3] = alpha;
  if (alpha === 0) clearedCount++;
}

await sharp(data, { raw: { width, height, channels } }).png({ compressionLevel: 9 }).toFile(outputPath);

const pct = ((clearedCount / (width * height)) * 100).toFixed(1);
console.log(`done: ${path.relative(projectRoot, outputPath)} (${width}x${height}, 背景として透過: ${pct}%)`);
