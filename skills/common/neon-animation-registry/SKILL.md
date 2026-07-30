---
name: neon-animation-registry
description: LP/HP/バナー等の制作中に新しく作った・参考サイト分析で発見したアニメーション技法を、Neon「LPポートフォリオ」DBのanimationsテーブル（gallery/のアニメーションスニペット集）へ汎用スニペットとして登録する。「このアニメーションをネオンに登録して」「新しい演出をスニペット化して」等の指示、または新規アニメーション実装・参考サイト分析で今までカタログに無い技法を作った/見つけたときに使う。
---

# Neon アニメーションスニペット登録

このリポジトリでは、LP/HP/バナー制作の中で作った・参考サイト分析で発見したアニメーション技法を、プロジェクトを横断して再利用できるよう `gallery/animations-data.mjs` → Neon Postgres「LPポートフォリオ」プロジェクトの `animations` テーブルへ集約している（[[neon_animations_snippet_db]]）。新しいアニメーション技法が生まれたら、**都度確認を挟まず**このスキルに沿って登録する。

## いつ登録するか

- LP/HP/バナー等の実装中に、既存カタログ（`gallery/animations-data.mjs`、`gallery/animations-preview.html` で閲覧可）に無い新しい演出を自分で組んだとき。
- 参考サイト分析（`references/`配下のドキュメント化作業やhp-creatorの分析工程）で、既存カタログに無い技法（構造・タイミング・イージング）を発見し、技法として汎用化できたとき。
- **登録しないもの**：静的なレイアウト・配置技法（ジグザグオフセット等、動きを伴わないもの）や、既存カタログと実質同じ技法の焼き直し。既存カタログに近いものが無いか先に `gallery/animations-data.mjs` を検索してから追加すること。

## 正本の在り処と反映の仕組み

1. **`gallery/animations-data.mjs`** — 全アニメーションスニペットの正本（JS配列）。ここに1件追加する。
2. **`gallery/scripts/seed-animations.mjs`** — `animations-data.mjs` を読み込み、Neon「LPポートフォリオ」プロジェクトの `animations` テーブルへ `slug` をキーに upsert する。
3. **`gallery/scripts/build-preview.mjs`** — 同じ `animations-data.mjs` から `gallery/animations-preview.html`（ローカルプレビュー、カテゴリ別にカード表示・実際に動くデモ）を再生成する。

いずれも `gallery/.env` の `DATABASE_URL` を使う（既存プロジェクトで設定済みのはず。無ければユーザーに確認する）。

## 登録するエントリのスキーマ

`animations` テーブル / `upsertAnimation()`（`gallery/scripts/db.mjs`）が受け付けるフィールド：

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `slug` | string | ✓ | 一意のkebab-case ID（例: `blob-icon-float`）。重複させない＝upsertの衝突キー。 |
| `name` | string | ✓ | 日本語の表示名。 |
| `category` | string | ✓ | 下記の固定カテゴリ一覧から選ぶ（新カテゴリを増やさない）。 |
| `description` | string | ✓ | 1〜2文で「何が起きるか」を説明。 |
| `cssCode` | string | ✓ | 汎用CSS（`@keyframes`込み）。プロジェクト固有のクラス名・CSS Modules前提の書き方は避け、素のクラス名にする。 |
| `htmlSnippet` | string | 任意 | 動作確認できる最小HTML。画像パスは実在しないファイルを参照しない（プレビューで壊れて見えるため、インラインSVGか絵文字/テキストで代替する）。 |
| `jsCode` | string \| null | 任意 | JSが必要な場合のみ。CSSのみで完結するなら `null`。 |
| `tags` | string[] | ✓ | 機能・用途キーワード（英語/日本語混在可、既存タグの語彙に寄せる）。 |
| `useCase` | string | ✓ | どんな場面で使うと良いか、1文。 |
| `moodTags` | string[] | ✓ | 下記の固定ムード語彙から選ぶ（新語を増やさない）。 |

### 既存の `category` 一覧（このいずれかを使う）
`title`, `scroll`, `button`, `cta`, `image`, `number`, `background`, `navigation`, `notification`, `loading`, `form`, `ui`, `icon`, `progress`, `装飾`

### 既存の `moodTags` 語彙（このいずれかを使う）
`オシャレ`, `見やすい`, `ポップ`, `派手`, `シンプル`, `カッコイイ`, `ラグジュアリー`, `信頼感`, `モダン`, `やさしい`, `上品`, `幻想的`, `緊急感`, `スマホライク`

新しいカテゴリ/ムードが本当に必要そうな場合のみ、ユーザーに一言確認してから増やす。

## 手順

1. `gallery/animations-data.mjs` を検索し、同種の技法が既に無いか確認する。
2. 配列の最後の要素の直後（閉じ`];`の前）に、上記スキーマ通りの新しいオブジェクトを追加する。既存エントリと同じインデント・書式（テンプレートリテラルでCSS/HTMLを書く）に揃える。
3. `prefers-reduced-motion` への配慮（無限ループ系は特に）をCSSに含める。
4. `cd gallery && node scripts/seed-animations.mjs` を実行し、Neonへ登録する（実行結果に対象slugの「登録: <slug>」が出ることを確認）。
5. `node scripts/build-preview.mjs` を実行し、ローカルプレビューを再生成する。
6. 可能であれば `gallery/animations-preview.html` をブラウザで開き（`file://`直開きがブロックされる環境では `python3 -m http.server`等で一時的にローカル配信する）、該当カテゴリのカードで実際に動いているか目視確認する。壊れた画像やアニメーションしていない場合は、htmlSnippetやCSSを直して4〜6を再実行する。
7. ユーザーに登録できたことを伝える（スラッグ・カテゴリ・確認できたプレビューのスクリーンショット等）。

## 登録サンプル（実際に登録した例）

トドマツ採用サイト（`projects/todomatsu-recruit/`）の職種紹介ページで、参考サイト分析から発見した「ブロブ型の枠と中身がそれぞれ違う周期で揺れ続ける」演出を汎用化して登録した例。

```js
{
  slug: "blob-icon-float",
  name: "ブロブ型アイコンの浮遊アニメーション",
  category: "icon",
  description: "不定形(ブロブ)の枠と中のアイコン/画像が、それぞれ違う周期で横揺れ・縦揺れを繰り返し、常に軽く浮遊しているような有機的な質感を出す。スクロールとは無関係に常時ループする。",
  cssCode: `.blob-icon {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 63% 37% 54% 46% / 43% 37% 63% 57%;
  background: #efe9dc;
  animation: blob-float-x 2s ease-in-out infinite alternate;
}
.blob-icon img,
.blob-icon svg {
  width: 40px;
  height: 40px;
  animation: blob-float-y 1.8s ease-in-out infinite alternate;
}
@keyframes blob-float-x {
  from { transform: translateX(-14px); }
  to { transform: translateX(14px); }
}
@keyframes blob-float-y {
  from { transform: translateY(-10px); }
  to { transform: translateY(10px); }
}
@media (prefers-reduced-motion: reduce) {
  .blob-icon, .blob-icon img, .blob-icon svg { animation: none; }
}`,
  htmlSnippet: `<span class="blob-icon">
  <svg viewBox="0 0 24 24" fill="none" stroke="#2c4a3b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 8h16l-1.5 10a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 8Z" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
  </svg>
</span>`,
  jsCode: null,
  tags: ["icon", "blob", "organic", "float", "職種紹介", "スタッフ紹介", "常時ループ"],
  useCase: "職種紹介・スタッフ紹介・サービス一覧などのアイコンやミニイラストを常にゆっくり揺らして生き生きとした印象にしたい場面。枠を大きくすれば単独の背景装飾シェイプとしても流用できる。",
  moodTags: ["オシャレ", "ポップ", "やさしい"]
}
```

## 実装先のプロジェクトへ組み込むときの注意（CSS Modulesの罠）

Next.js等のCSS Modules環境で、上記のような共有アニメーションを**複数コンポーネントで使い回そうとして`globals.css`（非モジュール）に`@keyframes`を1つだけ定義し、各コンポーネントの`.module.css`から`animation-name: floatX`のようにファイル外から参照する**と、CSS Modulesが`animation-name`の値もローカルスコープの識別子として扱いハッシュ化してしまうため、実際の`@keyframes`名と一致せずアニメーションが無反応になる（DevToolsの`animation-name`が変な文字列になり、`transform`が初期値のまま動かない）。**`@keyframes`は参照する`.module.css`ファイルごとに個別定義する**（多少の重複は許容する）のが確実な回避策。
