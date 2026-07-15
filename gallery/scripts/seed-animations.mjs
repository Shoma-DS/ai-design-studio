import { animations } from "../animations-data.mjs";
import { upsertAnimation } from "./db.mjs";

for (const entry of animations) {
  await upsertAnimation(entry);
  console.log(`登録: ${entry.slug}`);
}

console.log(`完了: ${animations.length}件を animations に登録しました。`);
