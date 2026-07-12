import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");

await sql.query(schema);
console.log("websites テーブルを作成/確認しました。");
