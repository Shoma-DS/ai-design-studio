---
name: lp-hybrid-image-html
description: 参考画像/参考サイトをもとに、AI生成セクション画像とHTML/CSS/JSを組み合わせたハイブリッド構成でLPを作る。ボタン・ナビ・フォーム・ホバー演出・スクロールアニメーション・カルーセル・アコーディオンなど操作が必要な要素は画像に焼き込まず実装する。
---

# LP ハイブリッド構成（画像 + HTML/CSS/JS）

このスキルは、参考画像（実サイトのスクリーンショット等）のデザイン・構成を踏襲しつつ、**静的なビジュアル/コピーはAI生成画像、操作が必要な要素は実HTML/CSS/JS**という役割分担でLPを作るときに使う。

`skills/design/lp-creator`（画像を縦結合するだけの完全画像LP）と `skills/design/lp-responsive` の中間にあたる手法。ボタンのホバー演出やスクロールアニメーションを本物のインタラクションとして機能させたいが、既存の「セクション画像をAI生成する」パイプラインの資産（`server/codexImageClient.mjs`、色・雰囲気ルールの言語化ノウハウ）も活かしたい場合に選ぶ。

## 使う場面

- ユーザーが実在サイトのスクリーンショット/URLを参考に「同じような雰囲気のLPを作って」と依頼し、かつボタン・ナビ・カルーセル・アコーディオン・ホバー/スクロールアニメーションなど**操作を伴う要素**を求めている場合。
- 完全な画像1枚のLP（`lp-creator`）では実現できない、実際に押せる/開閉できる/切り替わるUIが必要なとき。

## 手順

### Step 1 — 参考の分析

参考画像を `Read` で確認し（縦長スクリーンショットは自動的に縮小表示されるので、まずそのまま読む）、次を言語化する。

- 業種・提供価値・キャッチコピーのトーン
- 配色（背景色、アクセントカラー、写真かイラストかフラットか）
- 余白の取り方、セクションの区切り方（背景色の切り替え、罫線、余白量）
- セクション構成（上から順に、各セクションの役割）
- **どの要素が「静的な見た目」で、どの要素が「操作が必要」か**を仕分ける（ナビ、CTAボタン、カルーセルの矢印/ドット、アコーディオンの開閉、フォーム、ホバーで変化するカード等は操作が必要 = HTML/CSS/JS実装対象）

### Step 2 — 架空ブランドとしてLP原稿を作る

`skills/design/lp-creator` と同じ注意点に従う。

- 実在企業名・商品名・ロゴ・コピーの模写は禁止。完全オリジナルの架空ブランド名・コピーを作る。
- `copy/LP原稿.md` に、セクションごとの構成と、各セクションが「画像で焼き込む部分」と「HTML/CSSで重ねる部分」の対応表を明記する。

### Step 3 — セクション画像を生成する（操作要素は空けておく）

`skills/design/image-prompt-generator` の形式でプロンプトを作り、`server/codexImageClient.mjs` の `generateImageWithCodexAppServer` で生成する（`skills/common/codex-image-auth` の認証手順に従う）。

**画像プロンプトに必ず含めること：**

- そのセクションに実装予定のボタン・リンク・矢印・ドットなどがある場合、「該当箇所には装飾のみを配置し、実際のボタン風のテキストや枠線オブジェクトは描かない／もしくは十分な余白のみを残す」と明記し、後からHTML要素を重ねても不自然にならないようにする。
- 完全に画像内では完結しないカルーセルやアコーディオンのような動的UIセクションは、**そもそも画像化しない**（Step 4でHTML/CSS/JSとして実装する）。

### Step 4 — 動的UIはHTML/CSS/JSで実装する

カルーセル、アコーディオン、フォーム、モーダル等、状態を持つUIは画像にせず最初からコードで作る。デザインのトーン（配色・角丸・余白）だけ参考画像や他セクションの画像と揃える。

### Step 5 — HTML/CSSに組み込む

1. 各セクションを `<section style="position:relative">` にし、生成したセクション画像を背景/`<img>`として配置する。
2. Step3で余白を空けたボタン・リンクの位置に、実際の `<a>`/`<button>` 要素を `position:absolute` で正確に重ねる。座標は生成画像を見ながら調整し、**画像内の装飾と重複・二重表示にならないこと**を目視確認する。
3. ボタン・リンクには `skills/design/hover-animations`（Hover.css由来）のホバー演出を適用する。
4. 各セクションに `skills/design/lp-responsive` と同様のスクロール連動フェードイン（IntersectionObserverでの`.reveal`パターン）を入れる。必要に応じて `skills/design/animate-css` のスライドイン系も使う。
5. ヘッダーナビ・ハンバーガーメニューは `portfolio/awavie-carbonated-skincare-lp` の実装（フルスクリーンオーバーレイ、`<nav>`は`<header>`の外の兄弟要素にしてz-index/stacking contextの罠を避ける）をベースに流用してよい。

### Step 6 — レスポンシブ確認

`skills/design/lp-responsive` に従い、PC/スマホでボタンの重ね位置がずれないか確認する。画像内の余白位置は解像度によって相対位置が変わるため、ボタンの絶対座標は `%` やコンテナ基準のflex/grid配置にし、pxのハードコードは避ける。

### Step 7 — ローカルプレビューで最終確認

`python3 -m http.server` 等でローカル確認し、次を必ず目視する。

- HTML要素が画像内の対応する空白に正しく重なっているか（ズレ・二重表示がないか）
- ボタンのホバー演出、カルーセルの矢印/ドット、アコーディオンの開閉が実際に機能するか
- スクロール時のフェードイン/スライドインが自然か
- PC/スマホ両方の崩れ

### Step 8 — ギャラリーに追加してVercelへデプロイ

`skills/lp-design/vercel-free-deploy` に従う。

1. `scripts/generate-thumbnail.mjs` でサムネイルを生成し、`gallery/data.js` にエントリを追加。
2. LP本体とギャラリー、両方を `vercel --prod --yes` でデプロイ。
3. 初回デプロイ時、プロジェクト名がディレクトリ名（`lp`等）の汎用名になっていないか `vercel project ls` で確認し、必要なら `vercel project rename` で正しい名前に直してからエイリアスを設定する。
4. 本番URLができたら確認なしで `open -a "Google Chrome" "<本番URL>"` で開く（標準運用）。

## 関連

- 画像のみの完全LP: `skills/design/lp-creator`
- レスポンシブ対応: `skills/design/lp-responsive`
- ホバー演出: `skills/design/hover-animations`
- 登場・退場アニメーション: `skills/design/animate-css`
- 画像生成の認証確認: `skills/common/codex-image-auth`
- 公開: `skills/lp-design/vercel-free-deploy`
- 実装例: `portfolio/awavie-carbonated-skincare-lp`（ハンバーガーメニュー・スクロールフェードインの参考実装）
