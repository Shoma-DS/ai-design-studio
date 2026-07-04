import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lpDir = path.join(repoRoot, "projects", "ai-income-course", "ver01-fresh-green", "lp");
const targetDir = path.join(repoRoot, "dist", "lp-assets");

function shouldCopy(source) {
  const relative = path.relative(lpDir, source).split(path.sep).join("/");
  if (!relative) return true;
  if (relative === ".vercel" || relative.startsWith(".vercel/")) return false;
  if (relative === ".DS_Store" || relative.endsWith("/.DS_Store")) return false;
  if (relative === "images/lp-full.png") return false;
  if (relative.startsWith("images/") && relative.toLowerCase().endsWith(".png")) return false;
  return true;
}

await fs.rm(targetDir, { recursive: true, force: true });
await fs.cp(lpDir, targetDir, {
  recursive: true,
  filter: shouldCopy
});

console.log(`Copied LP assets to ${path.relative(repoRoot, targetDir)}`);
