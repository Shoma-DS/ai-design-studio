import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { project, sections, buildPrompt } from "../sections.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptDir = path.join(projectRoot, "prompts");
const copyPath = path.join(projectRoot, "copy/lp-copy.md");
const promptMarkdownPath = path.join(projectRoot, "section-image-prompts.md");

function mdEscape(value) {
  return String(value).replace(/\|/g, "\\|");
}

async function ensureDirs() {
  await fs.mkdir(promptDir, { recursive: true });
  await fs.mkdir(path.dirname(copyPath), { recursive: true });
}

async function writeCopy() {
  const lines = [
    "# BEAUTE Fleur Marine 2026 Summer Campaign LP セクション別原稿",
    "",
    "参照PNG(月野さん.png)の構成量に合わせ、元LPの商標・文言・人物・料金は使わず、架空の美容脱毛・コルギサロンLPとして再構成する。",
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
    "# BEAUTE Fleur Marine 2026 Summer Campaign LP セクション別画像プロンプト",
    "",
    "参考画像は構造・視線誘導・雰囲気のみを抽出し、コピー／トレース／商標再現は禁止。",
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

await ensureDirs();
await writeCopy();
await writePrompts();

console.log(`Wrote ${sections.length} sections`);
console.log(path.relative(projectRoot, copyPath));
console.log(path.relative(projectRoot, promptMarkdownPath));
