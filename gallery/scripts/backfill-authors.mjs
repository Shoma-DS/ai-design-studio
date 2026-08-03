// author（制作者）が未記録のportfolio_itemsを、Gitの履歴から埋め戻すスクリプト。
//
// 判定順:
//   1. gallery/assets/thumbnails/<slug>.jpg を最初に追加したコミットの作者
//   2. slug を名前に含むファイル（プロジェクトフォルダ等）を最初に追加したコミットの作者
// どちらも見つからない作品（リポジトリ外で作られてDBだけに登録されたもの）はnullのまま残す。
//
// 使い方:
//   node scripts/backfill-authors.mjs          # 対象一覧を表示するだけ（dry run）
//   node scripts/backfill-authors.mjs --apply  # DBへ書き込む

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");
const apply = process.argv.includes("--apply");

function firstCommitAuthor(pathspec) {
  try {
    const out = execFileSync("git", ["log", "--diff-filter=A", "--format=%an", "--", pathspec], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    })
      .trim()
      .split("\n")
      .filter(Boolean);
    return out.length ? out[out.length - 1] : null; // 末尾＝最初のコミット
  } catch {
    return null;
  }
}

function guessAuthor(slug) {
  return firstCommitAuthor(`gallery/assets/thumbnails/${slug}.jpg`) ?? firstCommitAuthor(`*${slug}*`);
}

const rows = await sql`select slug, type, author from portfolio_items order by created_at asc`;
const targets = rows.filter((row) => !row.author);

let filled = 0;
for (const row of targets) {
  const author = guessAuthor(row.slug);
  console.log(`${row.slug} (${row.type}) => ${author ?? "判定不能（スキップ）"}`);
  if (author && apply) {
    await sql`update portfolio_items set author = ${author} where slug = ${row.slug} and author is null`;
    filled += 1;
  }
}

console.log(
  apply
    ? `\n${filled}件にauthorを記録しました（未記録 ${targets.length - filled}件 / 全${rows.length}件）。`
    : `\ndry run。--apply を付けると書き込みます（対象 ${targets.length}件 / 全${rows.length}件）。`
);
