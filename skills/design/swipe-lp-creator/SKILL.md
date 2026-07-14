---
name: swipe-lp-creator
description: 縦スワイプ型カルーセルLP（構成05）を、架空ブランドの原稿作成から画像生成・HTML/CSS/JS実装・サムネイル・Vercel公開・ギャラリー登録まで一気通貫で作る。Use when the user wants a new swipe-type/carousel LP, スワイプ型LP, カード送りLP, Instagram/TikTokリール風の1画面1カードLPを作って、と依頼された場合。
---

# スワイプ型LP制作（構成05）

構成の型そのものは `skills/design/lp-layout-templates/SKILL.md` の「構成05」を参照する。このスキルは、その型を実際に動くLPとして作り切るための実装フロー（原稿→画像プロンプト→画像生成→HTML/CSS/JS→公開→ギャラリー登録）を扱う。
実装例: `portfolio/nobiru-consulting-swipe-lp/`（情報訴求型）、`portfolio/lumiere-nail-atelier-swipe-lp/`（ポートフォリオ型、セクション別ファイル管理の最新形）。

## Step 0: スタイルを決める

構成05には3系統ある。ユーザー指定がなければ商材の性質で判断し、迷う場合はユーザーに確認する。

- **感情訴求型**（5枚程度、写真主体、コピー少なめ）: 美容室・サロン・飲食店など、雰囲気で惹きつける業種向け。
- **情報訴求型**（7〜8枚、数字・チェックリスト・お客様の声・代表挨拶を積み上げる）: 士業・コンサル・BtoBなど、検討期間が長く納得感の積み上げが必要な業種向け。カード構成の目安: フック→実績数字→悩みチェックリスト→解決策（番号リスト）→お客様の声（1人1カード）→代表挨拶→最終オファー。
- **ポートフォリオ型**（5〜6枚、コピーはブランド名・タグライン・一言ラベル程度に極限まで削る）: ネイルサロン・ヘアサロン・写真スタジオなど、作品の写真そのものが訴求力を持つ業種向け。カード構成の目安: フック（ブランド名＋一言）→作品ポートフォリオ×3〜4（デザイン名ラベルのみ）→世界観・信頼カード（一言トラスト訴求）→最終CTA。参考: Tokify社のスワイプLP（`voguenail.tokify.shop`等）はこの型の実例で、コピーを一切持たず写真/動画だけで見せる構成だった。

## Step 1: 架空ブランド・原稿（セクションごとに個別ファイル化する）

`skills/design/lp-creator` と同じ注意点に従う（実在企業・商品・ロゴ・コピーの模写は禁止、完全オリジナルの架空ブランド）。

1. `portfolio/<slug>/copy/構成.md` に、ブランド設定・参考分析・カード構成の全体像（一覧表）を作る。
2. 各カードの画像プロンプトは `portfolio/<slug>/copy/prompts/<section-id>.md` として**1カード1ファイル**で作る。1ファイルにまとめない（AGENTS.mdの「原稿、セクション別画像プロンプト、生成画像、結合LPを分けて保存する」に従う）。ファイル内フォーマット:
   ```markdown
   # <section-id>（カードの役割）

   共通ルール（全セクション共通）:
   - 縦型9:16、1080×1920px相当のスマホ縦画面いっぱいに写る構図
   - 写真（実写風）のみで、文字・ロゴ・グラフィック装飾・キャプションは一切焼き込まない
   - 商標・実在人物・実在ブランドの模写は禁止、完全にオリジナルとして生成する

   ## プロンプト

   （実際のプロンプト本文）
   ```
   `section-id` は生成する画像ファイル名（`01-hook` など）と一致させ、あとで画像・HTML・スクリプトを横断して同じ名前で追跡できるようにする。
   実装例: `portfolio/lumiere-nail-atelier-swipe-lp/copy/prompts/`（6ファイル）。

## Step 2: フォルダ構成

```
portfolio/<slug>/
  copy/構成.md
  copy/prompts/<section-id>.md   # カードごとの画像プロンプト（Step 1）
  lp/images/
  scripts/generate-images.mjs
  outputs/
  references/
```

## Step 3: 画像生成（プロンプトファイルから読み込む・重要な落とし穴）

- `scripts/generate-images.mjs` はプロンプト文字列をスクリプト内にハードコードせず、`copy/prompts/<section-id>.md` を読み込んで `## プロンプト` 以降を抽出して使う。原稿（プロンプト）とコード（生成ロジック）を分離し、プロンプトだけを見直したいときにスクリプトを触らずに済むようにする。実装例: `portfolio/lumiere-nail-atelier-swipe-lp/scripts/generate-images.mjs` の `loadPrompt(id)`。
- 各カード背景は縦9:16のポートレート写真1枚。文字・ロゴは画像に焼き込まず、後からHTML/CSSで重ねる。
- `generateImageWithCodexAppServer` を呼ぶとき、**`taskType: "section"`（デフォルト）を使わない。** このtaskTypeは「PC/デスクトップ表示前提、最大幅1200pxで自然な高さに」という指示が内部で強制的に付与され、プロンプトで9:16を明記していても横長〜正方形の画像が返ってくる（実際に8枚中6枚が横長で返ってきた実績あり）。`taskType: "showcase"` を使うと、プロンプトのアスペクト比指定がそのまま尊重される。
- プロンプトには次を明記する: 「幅1080px×高さ1920px（width < height）」「横長・正方形の構図は禁止」「被写体はカメラを寄せる／立ち位置を工夫して縦構図に収める」。
- スクリプトの基本形（`refImages: []`、`taskType: "showcase"`、並列生成、生成済みファイルはスキップ）は `portfolio/nobiru-consulting-swipe-lp/scripts/generate-images.mjs` と `portfolio/lumiere-nail-atelier-swipe-lp/scripts/generate-images.mjs` を参照。後者がプロンプトファイル読み込み対応版で、新規プロジェクトはこちらの形を基本にする。

## Step 4: HTML/CSS/JS実装

カルーセルの基本JSロジック（Pointer Events + `setPointerCapture` によるマウス/タッチ/ペン統一、矢印ナビ、インジケータードット）は `skills/design/lp-layout-templates/SKILL.md` 構成05の「実装上の注意」を参照。加えて、情報訴求型で確立した以下のパターンを使う。

- **カードタイプの使い分け**: hook / achievement / testimonial / rep / final-cta は写真フル背景＋下部scrim＋テキストオーバーレイでよい。concern（悩み共感）や solution（解決策）のようにチェックリスト・番号リストなど情報量が多いカードは、写真の上に半透明の浮き島カードを重ねて可読性を確保する（`background: rgba(8,12,20,0.6); backdrop-filter: blur(6px); border-radius: 20px;`）。
- **下部scrimは情報量に応じて強める**: テキストが多いカードでは、最初の行（eyebrow）が写真の明るい部分にかかりやすくコントラスト不足になる。`card-scrim--bottom` は最低でも `rgba(0,0,0,0.85) 0% → 0.6 40% → 0.28 62% → 0 85%` 程度の多段グラデーションにする。1段階の弱いグラデーションだとeyebrowが白飛びした背景に埋もれる。
- **常時表示CTAバー**: 最終カードだけにCTAボタンを置くと、そこまでスワイプしないと申込導線が見えない。`.carousel` 直下に `position: absolute; bottom: 0;` の固定バー（`.sticky-cta`）を置き、全カード共通で表示する。最終カード自体には重複ボタンを置かず固定バーに一本化し、タップ時は `goTo(cards.length - 1)` で最終オファーカードへジャンプさせる。
- **インジケーターの位置**: 固定CTAバーと重ならないよう、`.indicator` の `bottom` をCTAバーの高さ分（目安94px）上げる。

## Step 5: モバイルファースト固定幅（PC対応はしない）

構成05のスワイプLPはスマホ専用として作る。**フルブリードで画面幅いっぱいに引き伸ばす実装（`width: 100%` のみで`max-width`を設けない）はNG** — PC幅で見ると縦長写真が横に間延び・トリミングされて破綻する。`.carousel` は `max-width: 430px; margin: 0 auto;` で固定し、PC表示の見栄えは作り込まない。ユーザーから明示の指定がなければ、この固定幅をデフォルトにする。

## Step 6: サムネイル・公開・Neon DB（ギャラリー）登録

LP単体を公開して終わりにせず、必ずポートフォリオギャラリー（Neon Postgres `landing_pages`テーブル）まで登録する。2026-07-10からユーザー承認済みの標準工程なので、都度確認は不要。

1. サムネイル生成: `node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> gallery/assets/thumbnails/<slug>.jpg`
2. Vercel公開: `skills/lp-design/vercel-free-deploy/SKILL.md` に従う。初回は `npx vercel link --project <slug>` でプロジェクト名を明示してから `--prod` で公開する。
3. **Neon DBへ登録する（ここが抜けやすいので必ず実行する）**: `skills/lp-design/lp-gallery-sync/SKILL.md` に従い、`gallery/scripts/add-landing-page.mjs` でエントリJSONを`landing_pages`テーブルにupsertし、`cd gallery && npx vercel --prod --yes` でギャラリーサイトを再公開する。**`featureTags` に「スワイプ」を必ず含める。** これは単なる表示タグではなく、`gallery/script.js` の `isMobileOnlyItem()` が参照する機能フラグで、含めるとギャラリーのプレビューモーダルでPCタブが自動的に消え、スマホタブ固定で開くようになる（2026-07-14実装）。実態と矛盾するため「レスポンシブ」タグは付けない。
4. 登録後、`curl -sS https://lp-portfolio-gallery.vercel.app/api/landing-pages` で新規slugがNeon DB経由で返ってくることを確認する。

## 関連

- 型の定義: `skills/design/lp-layout-templates/SKILL.md`（構成05）
- 画像生成の基盤: `server/codexImageClient.mjs`
- 公開: `skills/lp-design/vercel-free-deploy/SKILL.md`
- ギャラリー登録: `skills/lp-design/lp-gallery-sync/SKILL.md`
- 実装例（情報訴求型）: `portfolio/nobiru-consulting-swipe-lp/`
- 実装例（ポートフォリオ型、プロンプトのセクション別ファイル管理版）: `portfolio/lumiere-nail-atelier-swipe-lp/`
