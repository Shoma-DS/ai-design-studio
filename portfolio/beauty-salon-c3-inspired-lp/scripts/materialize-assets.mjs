import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { project, sections, buildPrompt } from "../sections.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const projectRoot = path.join(repoRoot, "portfolio/beauty-salon-c3-inspired-lp");
const promptDir = path.join(projectRoot, "prompts");
const refDir = path.join(projectRoot, "references");
const copyPath = path.join(projectRoot, "copy/lp-copy.md");
const promptMarkdownPath = path.join(projectRoot, "section-image-prompts.md");
const sourcePath = path.join(repoRoot, project.sourceImage);

function mdEscape(value) {
  return String(value).replace(/\|/g, "\\|");
}

async function ensureDirs() {
  await fs.mkdir(promptDir, { recursive: true });
  await fs.mkdir(refDir, { recursive: true });
  await fs.mkdir(path.dirname(copyPath), { recursive: true });
}

async function writeCopy() {
  const lines = [
    "# Lumiere Smooth Beauty LP Portfolio セクション別LP原稿",
    "",
    "参照PNGの構成量に合わせ、元LPの商標・文言・人物・料金は使わず、架空の美容サロンLP制作ポートフォリオとして再構成する。",
    "",
  ];
  for (const section of sections) {
    lines.push(`## ${section.id} ${section.title}`, "");
    for (const item of section.copy) lines.push(`- ${item}`);
    lines.push("");
  }
  await fs.writeFile(copyPath, `${lines.join("\n").trim()}\n`, "utf8");
}

async function writePrompts() {
  const md = [
    "# Lumiere Smooth Beauty LP Portfolio セクション別画像プロンプト",
    "",
    "全プロンプトは nanobanana pro 形式。参考画像は構造・視線誘導・雰囲気のみを抽出し、コピー／トレース／商標再現は禁止。",
    "",
    "| ID | セクション | 画像 | 参照スライス |",
    "| --- | --- | --- | --- |",
  ];
  for (const section of sections) {
    const prompt = buildPrompt(section);
    const promptPath = path.join(promptDir, `${section.id}.txt`);
    await fs.writeFile(promptPath, prompt, "utf8");
    md.push(`| ${mdEscape(section.id)} | ${mdEscape(section.title)} | ${mdEscape(section.imageName)} | references/${section.id}.png |`);
  }
  md.push("");
  for (const section of sections) {
    md.push(`## ${section.id} ${section.title}`, "", "```text", buildPrompt(section), "```", "");
  }
  await fs.writeFile(promptMarkdownPath, `${md.join("\n").trim()}\n`, "utf8");
}

async function cropReferences() {
  for (const section of sections) {
    const out = path.join(refDir, `${section.id}.png`);
    await execFileAsync("magick", [
      sourcePath,
      "-crop",
      `981x${section.ref.h}+0+${section.ref.y}`,
      "+repage",
      out,
    ]);
  }
}

await ensureDirs();
await writeCopy();
await writePrompts();
await cropReferences();

console.log(`Wrote ${sections.length} sections`);
console.log(path.relative(repoRoot, copyPath));
console.log(path.relative(repoRoot, promptMarkdownPath));
