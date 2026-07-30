import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateImageWithCodexAppServer } from "../../server/codexImageClient.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const repoRoot = path.resolve(projectRoot, "../..");
const outputPath = path.join(projectRoot, "outputs", "hikari-fit-banner.png");

const prompt = `あなたは【トップクラスの広告バナーデザイナー】です。
目的：
架空の女性専用スポーツジム「ヒカリフィット」の、SNS/Web広告用の正方形バナー画像を作成する。

────────────────
【入力】
@img：なし：ゼロベース新規生成

【最重要ルール】
・実在のジム・実在人物・実在ブランドの再現は禁止。人物は架空のイラスト/写真風人物として新規に描く
・テキストはすべて下記コピーへ完全に書き換える
・情報を詰め込みすぎない。スマホで一瞬で内容が伝わる情報量にする
・極小文字は使わない（スマホ表示でも読める文字サイズ）
・正方形（1:1）フォーマット

【構図】
上部に人物写真（明るい表情でトレーニングウェアの女性、架空人物）を大きく配置し、その上に見出しとタグラインを重ねる。
写真の下、または横に3つの安心要素をアイコン付きバッジで並べる。
写真の右上または左下に丸バッジで一言訴求を添える。
最下部に価格・キャンペーン・CTAをまとめた帯を配置する。
視線誘導：タグライン→見出し→人物写真→3つの安心要素→丸バッジ→最下部の価格/CTA帯、という上から下への自然な流れ。

【タイトル】
メイン：「わたし史上、いちばん通いやすいジム」
サブ：「無理なく続けられる私になる」

【各セクションのコピー・内容】
・サブ見出しバッジ: 運動が苦手でも、安心して始められる
・安心要素1（アイコン: スニーカーまたはハート）: 女性専用だから安心
・安心要素2（アイコン: カレンダーまたは時計）: 予約不要でいつでもOK
・安心要素3（アイコン: 洋服またはバッグ）: 着替えなしの服装でも通える
・丸バッジ: 初めてでも、続けやすい
・最下部の帯（価格・キャンペーン・CTA）: 「今だけ」体験1回無料（通常3,300円）／駅から徒歩3分・年中無休・完全個室／CTAボタン「無料体験はこちらから」
・ブランド名（バナー左上または最下部）: ヒカリフィット HIKARI FIT

【色・雰囲気ルール】
女性向けを意識した、上品で温かみのあるピンク〜コーラル系を基調にした配色。ベタッとした濃いピンクの塗りつぶしではなく、淡いピンク・白・ベージュを組み合わせた柔らかい印象にする。差し色に温かみのあるゴールドまたはテラコッタを少量使う。
アイコンは完全な円形バッジの多用を避け、角丸の四角形フレームまたはシンプルな線画アイコンにする。
ボタンは角丸で控えめ、発光するグロー影は使わない。

【デザイン】
清潔感があり、圧迫感のない余白設計。文字と写真のコントラストがはっきりしていて、老眼の方でも読みやすい文字サイズ。手描き風のワンポイント装飾（小さな花や線画のアクセント）を控えめに使ってよい。

【出力条件】
・一目で理解できる
・スマホでも見やすい
・広告バナーとしてそのまま使える
・1080×1080px相当の正方形

【最終目的】
見た瞬間にこう思わせる：「運動が苦手な私でも、ここなら気軽に始められて続けられそう」`;

const generated = await generateImageWithCodexAppServer({
  prompt,
  sectionId: "hikari-fit-banner",
  imageName: "hikari-fit-banner.png",
  cwd: repoRoot,
  taskType: "showcase",
});

if (!generated.configured) {
  throw new Error(generated.message || "Codex app-server image generation is not configured.");
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, generated.buffer);
console.log(`saved: ${outputPath}`);
