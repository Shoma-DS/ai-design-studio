import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { sections } from "../sections.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const imageDir = path.join(repoRoot, "projects/beauty-salon-portfolio/c3-inspired-lp/lp/images");
const tmpDir = path.join(repoRoot, "projects/beauty-salon-portfolio/c3-inspired-lp/.tmp/contact");
const output = path.join(imageDir, "section-contact-sheet.png");

await fs.mkdir(tmpDir, { recursive: true });

const rows = [];
for (let row = 0; row < 6; row++) {
  const rowImages = [];
  for (let col = 0; col < 4; col++) {
    const section = sections[row * 4 + col];
    const src = path.join(imageDir, section.imageName);
    const out = path.join(tmpDir, `${section.id}.png`);
    await execFileAsync("magick", [src, "-resize", "220x440", "-gravity", "north", "-background", "white", "-extent", "220x440", out]);
    rowImages.push(out);
  }
  const rowOut = path.join(tmpDir, `row-${row}.png`);
  await execFileAsync("magick", [...rowImages, "+append", rowOut]);
  rows.push(rowOut);
}

await execFileAsync("magick", [...rows, "-append", output]);
console.log(path.relative(repoRoot, output));
