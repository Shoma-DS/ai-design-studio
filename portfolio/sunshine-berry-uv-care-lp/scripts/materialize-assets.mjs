import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sections, buildPrompt } from "../sections.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptDir = path.join(projectRoot, "prompts");
const promptMarkdownPath = path.join(projectRoot, "copy/section-image-prompts.md");

function mdEscape(value) {
  return String(value).replace(/\|/g, "\\|");
}

await fs.mkdir(promptDir, { recursive: true });

const md = [
  "# サンシャインベリー UVケアインナーサプリメント LP セクション別画像プロンプト",
  "",
  "全プロンプトは nanobanana pro 形式。参照画像は構造・配色トーン・視線誘導のみを抽出し、コピー／トレース／商標再現は禁止。",
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

console.log(`Wrote ${sections.length} prompt files`);
console.log(path.relative(projectRoot, promptMarkdownPath));
