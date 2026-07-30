# Hero（ファーストビュー）

## 役割

サイト全体のキャッチコピーと、4ステップ（トドマツを知る／現場を知る／専門性を磨く／先輩の声）への導線を提示する。

## レイアウト

- SP：縦積み（コピー→イラストの順、`flex-direction: column-reverse`でイラストを上部に）。
- PC（769px以上）：左44%にコピー、右にイラストの横並び。
- イラストは`<picture>`でPC（1024px以上：`hero-pc.png`）／SP（`hero-sp.png`）を出し分け。SP側はCSSの`aspect-ratio: 4/3.4`＋`object-fit: cover`で縦長の表示領域に収め、間延びさせない。

## コンテンツ

- Eyebrow：`TODOMATSU CO., LTD.`
- 見出し：「トドマツで働くとは？」
- リード文＋Step 01〜04へのアンカーリンク一覧（`src/data/site.ts`の`steps`）

## アニメーション・演出

- 右下に円形に回転する「Scroll」のテキストリング（SVG `textPath`＋CSS `@keyframes spin`、14s linear infinite）。PC幅（769px以上）のみ表示。
- Step一覧の各行はホバーで`gap`が広がるマイクロインタラクション。

## 画像生成プロンプトの要点

架空企業「トドマツ」の丘・針葉樹・店舗を用いた成長の道のりのイラスト。周囲に浮かぶ思考の雲の中に、レジ・バイヤー・店長・配送スタッフなど働く人々の情景を配置。詳細プロンプトは`scripts/sections.mjs`の`hero`モーメントを参照。
