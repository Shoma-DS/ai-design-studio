import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { project, sections } from "../sections.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/beauty-salon-c3-inspired-lp");
const lpRoot = path.join(projectRoot, "lp");
const imageDir = path.join(lpRoot, "images");
const fullPath = path.join(imageDir, "lp-full.png");

async function mustExist(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Missing image: ${path.relative(repoRoot, filePath)}`);
  }
}

await fs.mkdir(imageDir, { recursive: true });

for (const section of sections) {
  await mustExist(path.join(imageDir, section.imageName));
}

const imageNames = sections.map((s) => s.imageName);
const pyScript = `
import sys
from PIL import Image

image_dir = sys.argv[1]
names = sys.argv[2:-1]
out_width = int(sys.argv[-1])

imgs = []
for name in names:
    im = Image.open(f"{image_dir}/{name}").convert("RGB")
    if im.width != out_width:
        ratio = out_width / im.width
        im = im.resize((out_width, round(im.height * ratio)))
    imgs.append(im)

total_height = sum(im.height for im in imgs)
canvas = Image.new("RGB", (out_width, total_height), "white")
y = 0
for im in imgs:
    canvas.paste(im, (0, y))
    y += im.height

canvas.save(f"{image_dir}/lp-full.png")
`;

await execFileAsync("python3", ["-c", pyScript, imageDir, ...imageNames, String(project.outputWidth)]);

const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${project.title}</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <main class="lp-shell" aria-label="${project.title}">
      <img class="lp-full" src="./images/lp-full.png" alt="${project.title}">
    </main>
  </body>
</html>
`;

const css = `html,
body {
  margin: 0;
  min-height: 100%;
  background: #f8eef1;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif;
}

.lp-shell {
  width: min(100%, 1080px);
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 36px rgba(85, 42, 54, 0.18);
}

.lp-full {
  display: block;
  width: 100%;
  height: auto;
}
`;

await fs.writeFile(path.join(lpRoot, "index.html"), html, "utf8");
await fs.writeFile(path.join(lpRoot, "style.css"), css, "utf8");

console.log(path.relative(repoRoot, fullPath));
console.log(path.relative(repoRoot, path.join(lpRoot, "index.html")));
