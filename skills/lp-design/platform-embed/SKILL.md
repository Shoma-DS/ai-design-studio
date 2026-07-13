---
name: platform-embed
description: このスタジオの静的LP出力（index.html + style.css + images、ハイブリッドLPはJSも）を、WordPress／Wix／STUDIO／ペライチのカスタムHTML・埋め込み機能に貼り付けられる形式に変換する。Use when the user wants to deliver an LP into a client's WordPress, Wix, STUDIO, or Peraichi site instead of (or in addition to) Vercel/Xserver publishing.
---

# プラットフォーム埋め込み変換

このスタジオのLPは `lp/index.html` + `lp/style.css` + `lp/images/` の静的構成（`skills/design/lp-creator`）、またはそれにJSを加えたハイブリッド構成（`skills/design/lp-hybrid-image-html`）で作られる。WordPress・Wix・STUDIO・ペライチには「実コードをアップロードして公開する」導線がなく、それぞれの管理画面にある**カスタムコード埋め込み機能**にHTML/CSS/JSを貼り付ける形になる。このスキルは、その埋め込み用スニペットを作るために使う。

**重要な前提**: このリポジトリからは各プラットフォームの管理画面へログインできない。ブロックの設置・画像アップロード・プレビュー確認・公開ボタンを押す作業は、案件ごとに人（あなた）が実際の管理画面で行う。このスキルが作るのは「貼り付け用スニペット」までであり、貼り付け・公開作業そのものは自動化できない。

## 対応プラットフォームと埋め込み方式

| プラットフォーム | 埋め込み機能 | 描画方式 | 主な制約（要事前確認） |
|---|---|---|---|
| WordPress | カスタムHTMLブロック（ブロックエディタ）／HTMLウィジェット（Elementor等） | ページと同一DOM内にインライン | テーマ・プラグインによりCSS競合、`<script>`が管理者以外の投稿では制限される場合あり |
| ペライチ | HTMLブロック | ページと同一DOM内にインライン（要検証） | プラン（有料会員以上）でHTMLブロックの可否・`<script>`実行可否が変わる。契約前に対象クライアントのプランで実際に検証する |
| STUDIO | コードブロック | ページと同一DOM内にインライン（要検証） | 対応プランでのみ利用可（要最新のSTUDIO公式ドキュメント確認） |
| Wix | カスタム埋め込み（HTML iframe） | 独立したiframe内 | Premiumプラン以上が必要。iframeは独自ドキュメントなので `<html><head>` ごと使え、CSS競合は起きない代わりに高さ調整が必要 |

WordPress・ペライチ・STUDIOは「同一DOM内にインライン」なので、こちらのCSSがクライアントサイトの既存スタイルと衝突するリスクがある。Wixは「iframe」なのでCSS競合は起きないが、高さの自動調整に一手間かかる。

## 変換手順

### Step 1 — 対象LPと対象プラットフォームを確認する

- 変換元: `<project>/lp/index.html`, `lp/style.css`, `lp/images/`（ハイブリッドLPなら`lp/script.js`等も）
- 対象プラットフォームをユーザーに確認する（複数可）。プラットフォームによって処理が変わるため、都度これを最初に聞く。

### Step 2 — 画像の配置先を決める

クライアント側の管理画面に自分で画像をアップロードできない前提なので、基本方針は「画像はこのスタジオが公開済みのURL（Vercel/Xserverの公開URL）をそのまま参照する」。

1. 対象LPがまだVercel/Xserverに公開されていなければ、先に `skills/lp-design/vercel-free-deploy` または `skills/lp-design/xserver-publish` で公開する。
2. 埋め込みスニペット内の `<img src="./images/...">` は、公開済みの絶対URL（例: `https://<公開ドメイン>/images/...`）に置き換える。
3. クライアントが自社メディアライブラリへの画像アップロードを希望する場合は、アップロード後に発行されるURLへの差し替えが別途必要になる旨をユーザーに伝える（このスキルでは自動化しない）。

### Step 3 — CSSをインライン化する

埋め込み先には `<link rel="stylesheet">` で外部ファイルを読み込む導線がないため、`lp/style.css` の中身をそのまま `<style>...</style>` に包んで、埋め込みHTMLの直前に置く。

### Step 4 — 描画方式に応じてCSSをスコープする

- **Wix（iframe方式）**: スコープ不要。`index.html` の `<body>` の中身 + Step3の`<style>`をそのままiframe用コードとして使える。
- **WordPress／ペライチ／STUDIO（同一DOM方式）**: クライアントサイトの既存CSSと衝突しないよう、すべてのセレクタを一意なラッパークラス（例: `.aidsstudio-lp-<slug>`）配下にスコープし直す。
  1. 埋め込みHTML全体を `<div class="aidsstudio-lp-<slug>">...</div>` で包む。
  2. `style.css` の各セレクタ先頭に `.aidsstudio-lp-<slug> ` を付与する（`body`, `html`, `*` のようなグローバルセレクタが含まれていないか必ず確認し、あれば `.aidsstudio-lp-<slug>` 自身への指定に書き換える）。
  3. `box-sizing: border-box` などのリセット系宣言がクライアントサイトの他要素に影響しないよう、ラッパー配下限定になっているか確認する。

### Step 5 — JS（ハイブリッドLPのみ）の扱いを確認する

ハイブリッドLP（`skills/design/lp-hybrid-image-html`）はカルーセル・アコーディオン・ホバー演出などにJSを使う。埋め込み先が `<script>` を実行できるかはプラットフォーム・プラン・権限によって異なり、このリポジトリからは検証できない。

- 納品前に、実際の対象プラットフォーム・対象アカウントのカスタムコード欄に**テスト用の最小スクリプト**（例: `console.log`だけの`<script>`）を貼り、ブラウザのコンソールで実行されるか確認するようユーザーに依頼する。
- 実行されない場合は、動的UI（カルーセル・アコーディオン等）が非機能になる旨をクライアントに事前説明する必要がある。画像LP（`lp-creator`のみ、JSなし）であればこの制約は発生しない。

### Step 6 — 出力を保存する

変換済みスニペットは元プロジェクト配下に保存する。

```text
<project-name>/lp/embed/
  wordpress.html
  peraichi.html
  studio.html
  wix.html
```

各ファイルの先頭に、貼り付け先ブロック名・画像URLの前提・JS実行要確認事項をコメントで記載する。

## 納品時にユーザーへ伝えること

- 貼り付け・画像アップロード・プレビュー確認・公開ボタンの押下は、対象プラットフォームの管理画面で人が行う作業として残る。
- Wixはiframeの高さがコンテンツ量に応じて自動調整されない場合があるため、固定高さ設定または高さ自動調整アプリの要否を確認する。
- ペライチ・STUDIOの「HTMLブロック／コードブロック」機能の可否・プラン条件は変更されることがあるため、契約前に対象クライアントの実アカウントで必ず事前確認する。
