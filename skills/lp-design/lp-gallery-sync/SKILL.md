---
name: lp-gallery-sync
description: 公開済みLPをポートフォリオギャラリーサイト（gallery/, Neon Postgresのlanding_pagesテーブル）に登録・更新・再公開するスキル。Use when a new LP has been published to Vercel and needs to be added to the portfolio gallery, when updating/removing a gallery entry, when syncing landing_pages / gallery/data.js, or when asked about lp-portfolio-gallery, ギャラリーサイト, ポートフォリオ一覧, Neon DB登録.
---

# LP Gallery Sync

`gallery/`（Vercelプロジェクト `lp-portfolio-gallery`、公開URL `https://lp-portfolio-gallery.vercel.app`）は、これまで作った全LPを検索・タグ絞り込みできるポートフォリオ一覧サイト。データの正本は Neon Postgres の `landing_pages` テーブルで、サイトは `/api/landing-pages` 経由でDBから取得する。`gallery/data.js` はDB取得に失敗したときのオフラインフォールバックとしてのみ残している。

## 標準運用（2026-07-10からユーザー承認済み）

新しいLPをVercelに本番公開したら、**都度確認を取らずに**このスキルの手順でギャラリーへ登録・再公開する。これはユーザーが明示的に「今後作成したLPはここにもデプロイさせてください」と標準工程化した運用。ただし、登録対象のLP・スラッグが曖昧な場合や、スキーマ変更などの破壊的操作は通常どおり確認する。

## 前提・秘密情報

- DB接続情報（`DATABASE_URL`）は Vercelプロジェクト `lp-portfolio-gallery` の環境変数（production/preview/development）に設定済み。ローカルでは `gallery/.env`（Git管理外）に保存する。
- `gallery/.env` が無い場合は `cd gallery && npx vercel env pull .env --yes` で取得する。
- `.env`、接続文字列、パスワードをチャット出力やコミットに含めない。

## 手順

1. 対象LPがVercel本番公開済みであることを確認する（未公開なら `skills/lp-design/vercel-free-deploy/SKILL.md` に従って先に公開する）。
2. サムネイルを生成する。
   ```bash
   node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> gallery/assets/thumbnails/<slug>.jpg
   ```
3. エントリJSONを作る（既存カテゴリ・タグを優先して再利用し、フィルタが際限なく増えないようにする。既存の値は `landing_pages` をSELECTするか `gallery/data.js` を参照）。
   ```json
   {
     "slug": "<プロジェクトフォルダのslug>",
     "title": "<lp/index.htmlの<title>>",
     "heading": "<コピー原稿のキャッチコピー・見出し>",
     "category": "<カテゴリ1つ>",
     "moodTags": ["雰囲気タグ1", "雰囲気タグ2"],
     "productTags": ["商品タグ1", "商品タグ2"],
     "featureTags": ["機能タグ1"],
     "url": "<vercelの本番URL>",
     "thumbnail": "assets/thumbnails/<slug>.jpg"
   }
   ```
4. DBへ登録・更新する（slugが既存なら上書き更新、新規ならINSERTされる）。
   ```bash
   node gallery/scripts/add-landing-page.mjs <entry.json>
   ```
5. 任意: `gallery/data.js` のフォールバックも最新化したい場合は配列に同じ内容を追記する（必須ではない。DBが正本）。
6. ギャラリーサイトを再公開する。
   ```bash
   cd gallery && npx vercel --prod --yes
   ```
7. 公開後検証する。
   ```bash
   curl -I https://lp-portfolio-gallery.vercel.app/
   curl -sS https://lp-portfolio-gallery.vercel.app/api/landing-pages | node -e '...'  # 件数と新規slugの有無を確認
   ```
   新しいLP自体のURLも `curl -I` でHTTP 200を確認する。

## 関連ファイル

- スキーマ: `gallery/db/schema.sql`（`landing_pages`テーブル）
- API: `gallery/api/landing-pages.js`（DBから取得しJSON返却）
- フロント: `gallery/index.html` / `gallery/script.js` / `gallery/data.js`（フォールバック）
- 登録スクリプト: `gallery/scripts/add-landing-page.mjs`（1件upsert）, `gallery/scripts/seed-from-data-js.mjs`（`data.js`全件を一括投入し直す用）, `gallery/scripts/db.mjs`（DB接続共通処理）, `gallery/scripts/migrate.mjs`（スキーマ適用）

## 既存エントリの削除・一括更新

削除やカテゴリ一括変更など、SELECT/UPDATE/DELETEが必要な場合は `gallery/scripts/db.mjs` の `sql` をimportして直接SQLを書くか、Neonコンソール（`console.neon.tech`）のSQL Editorを使う。破壊的なSQL（DELETE/DROP等）を実行する前は、対象件数を確認し、ユーザーに一度提示する。

## 失敗時の切り分け

- `DATABASE_URL が設定されていません`: `gallery/.env` が無い/空。`npx vercel env pull .env --yes` を `gallery/` で実行する。
- `/api/landing-pages` が500やエラーJSONを返す: Vercel側の環境変数が古い/未設定の可能性。`npx vercel env ls` で確認する。
- ギャラリーの表示件数が増えない: ブラウザ/CDNキャッシュ（`Cache-Control: s-maxage=60`）の可能性。60秒待つか強制リロードして確認する。
