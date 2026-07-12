---
name: hp-gallery-sync
description: 公開済みHP（hp-creatorで作ったコーポレートサイト）をポートフォリオギャラリーサイト（gallery-hp/, Neon Postgresのwebsitesテーブル）に登録・更新・再公開するスキル。Use when a new HP/corporate site has been published to Vercel and needs to be added to the HP portfolio gallery, when updating/removing a gallery-hp entry, when syncing websites / gallery-hp/data.js, or when asked about hp-portfolio-gallery, gallery-hp, HPポートフォリオギャラリー.
---

# HP Gallery Sync

`gallery-hp/`（Vercelプロジェクト `gallery-hp`、公開URL `https://gallery-hp-rho.vercel.app`）は、`hp-creator`で作った全HP（コーポレートサイト）を検索・タグ絞り込みできるポートフォリオ一覧サイト。`gallery/`（LP用）のコードをそのまま複製・改修したもので、UI・フィルタ機構・プレビューモーダルの実装は同一。データの正本はNeon Postgresの`websites`テーブルで、サイトは`/api/websites`経由でDBから取得する。`gallery-hp/data.js`はDB取得に失敗したときのオフラインフォールバックとしてのみ使う。

## LPギャラリー（`gallery/`）との関係

- **同じNeon Postgresインスタンスを共有**している（接続文字列`DATABASE_URL`は`gallery/.env`と同じ値）。テーブルだけ`landing_pages`とは別の`websites`を使うので、互いのデータは混在しない。
- フロント（`index.html`/`script.js`/`style.css`）はLPギャラリーからコピーして「LP」表記を「HP」表記に置き換えただけの構成。UIを変更する場合は両者の差分に注意する。
- `script.js`内の`productMidCategories`（中カテゴリ定義）はLP側の業種一覧をベースにしているため、HP特有の業種を追加した場合はLP側と食い違う。両ギャラリーは独立ファイルなので、片方を直しても自動で揃わない。

## 標準運用について（重要・LPとの違い）

LPギャラリー（`gallery/`）は「2026-07-10からユーザー承認済み、都度確認不要」の標準運用だが、**HPギャラリー（`gallery-hp/`）は2026-07-12時点でまだそう明示されていない。** 新しいHPをVercel公開すること自体、DB登録すること、Vercelの環境変数へ秘密情報を書き込むことは、それぞれ「Explicit permission required」に該当しうる操作なので、都度チャットで確認してから進める。ユーザーが「今後はHPも都度確認せず自動でギャラリーに載せてほしい」と明示したら、その時点でこの節を更新し標準運用化する。

## 前提・秘密情報

- DB接続情報（`DATABASE_URL`）は Vercelプロジェクト `gallery-hp` の環境変数（production）に**設定済み**（2026-07-12、ユーザー明示許可のもと設定）。今後`gallery-hp`を再デプロイするだけなら、この設定は既に反映されているため再度env追加する必要はない。
- ローカルでは `gallery-hp/.env`（Git管理外、`.gitignore`で除外済み）に保存する。無ければ `gallery/.env` から同じ値をコピーするか、`cd gallery-hp && npx vercel env pull .env --yes` で取得する。
- **新しいVercelプロジェクトを作ってこのスキルを最初から適用する場合**（＝まだ`DATABASE_URL`をそのプロジェクトのVercel環境変数に設定していない場合）は、書き込み前に必ずユーザーへ「Vercel本番環境変数にDATABASE_URLを追加してよいか」を明示的に確認する。名前を伏せた一般的な許可（「公開して」等）だけでは実行しない。
- `.env`、接続文字列、パスワードをチャット出力やコミットに含めない。

## 手順

1. 対象HPがVercel本番公開済みであることを確認する（未公開なら `hp-creator` の手順9、または `skills/lp-design/vercel-free-deploy/SKILL.md` に従って先に公開する。公開はユーザーの明示的許可が必要）。
2. サムネイルを用意する。HPのトップページのヒーロー画像（`public/images/hero-pc.png`等）を流用し、macOS標準の`sips`でJPEG・幅1280pxに変換するのが簡単。
   ```bash
   sips -s format jpeg -Z 1280 projects/<slug>/public/images/hero-pc.png \
     --out gallery-hp/assets/thumbnails/<slug>.jpg
   ```
   スクリーンショットベースのサムネイルにしたい場合は `node scripts/generate-thumbnail.mjs` 等、LP側の仕組みが流用できないか先に確認する（HP側専用スクリプトは未整備、必要なら新規作成する）。
3. エントリJSONを作る（既存カテゴリ・タグを優先して再利用し、フィルタが際限なく増えないようにする。既存の値は`websites`をSELECTするか`gallery-hp/data.js`を参照。中カテゴリに無い業種を追加する場合は`gallery-hp/script.js`の`productMidCategories`にも追記する）。
   ```json
   {
     "slug": "<projects/配下のプロジェクトフォルダ名>",
     "title": "<サイトの<title>>",
     "heading": "<トップページのキャッチコピー>",
     "category": "<カテゴリ1つ>",
     "moodTags": ["雰囲気タグ1", "雰囲気タグ2"],
     "productTags": ["商品タグ1", "商品タグ2"],
     "featureTags": ["機能タグ1", "機能タグ2"],
     "url": "<Vercelの本番URL>",
     "thumbnail": "assets/thumbnails/<slug>.jpg"
   }
   ```
4. DBへ登録・更新する（slugが既存なら上書き更新、新規ならINSERTされる）。
   ```bash
   node gallery-hp/scripts/add-website.mjs <entry.json>
   ```
5. 任意：`gallery-hp/data.js`のフォールバックも最新化したい場合は配列に同じ内容を追記する（必須ではない。DBが正本）。オフライン時の見た目確認に有効。
6. ギャラリーサイトを再公開する（DB登録だけでは画面に反映されているが、`data.js`を更新した場合や初回デプロイ時は再公開が必要）。
   ```bash
   cd gallery-hp && npx vercel --prod --yes
   ```
7. 公開後検証する。
   ```bash
   curl -I https://gallery-hp-rho.vercel.app/
   curl -sS https://gallery-hp-rho.vercel.app/api/websites
   ```
   新しいHP自体のURLも`curl -I`でHTTP 200を確認する。

## 関連ファイル

- スキーマ: `gallery-hp/db/schema.sql`（`websites`テーブル）
- API: `gallery-hp/api/websites.js`（DBから取得しJSON返却）
- フロント: `gallery-hp/index.html` / `gallery-hp/script.js` / `gallery-hp/data.js`（フォールバック）
- 登録スクリプト: `gallery-hp/scripts/add-website.mjs`（1件upsert）, `gallery-hp/scripts/db.mjs`（DB接続共通処理・`upsertWebsite`）, `gallery-hp/scripts/migrate.mjs`（スキーマ適用）

## 既存エントリの削除・一括更新

削除やカテゴリ一括変更など、SELECT/UPDATE/DELETEが必要な場合は`gallery-hp/scripts/db.mjs`の`sql`をimportして直接SQLを書くか、Neonコンソール（`console.neon.tech`）のSQL Editorを使う。破壊的なSQL（DELETE/DROP等）を実行する前は、対象件数を確認し、ユーザーに一度提示する。

## 失敗時の切り分け

- `DATABASE_URL が設定されていません`: `gallery-hp/.env`が無い/空。`gallery/.env`から値をコピーするか、`npx vercel env pull .env --yes`を`gallery-hp/`で実行する。
- `/api/websites`が500やエラーJSONを返す: Vercel側の環境変数が古い/未設定の可能性。`npx vercel env ls`（`gallery-hp/`で実行）で確認する。環境変数追加自体はユーザーの明示的許可が必要（上記「前提・秘密情報」参照）。
- ギャラリーの表示件数が増えない: ブラウザ/CDNキャッシュ（`Cache-Control: s-maxage=60`）の可能性。60秒待つか強制リロードして確認する。
- カードのカテゴリタグが「その他」に入ってしまう: `gallery-hp/script.js`の`productMidCategories`（または`moodMidCategories`/`featureMidCategories`）に該当タグが登録されていない。追記して再デプロイする。
