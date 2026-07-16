---
name: lp-gallery-sync
description: 公開済みLP・HP・動くLP・スワイプLP・バナー・サムネ・SNS投稿・チラシを統合ポートフォリオギャラリーサイト（gallery/, Neon Postgresのportfolio_itemsテーブル）に登録・更新・再公開するスキル。Use when a new LP/HP/moving-lp/swipe-lp/banner/thumbnail/sns-post/flyer has been published or produced and needs to be added to the portfolio gallery, when updating/removing a gallery entry, when syncing portfolio_items / gallery/data.js, or when asked about portfolio gallery, ギャラリーサイト, ポートフォリオ一覧, Neon DB登録.
---

# Portfolio Gallery Sync

`gallery/`（Vercelプロジェクト `lp-portfolio-gallery`、公開URL `https://lp-portfolio-gallery.vercel.app`）は、これまで作った全作品（HP/LP/動くLP/スワイプLP/バナー/サムネ/SNS投稿/チラシ）をタイプタブ・検索・タグ絞り込みできる統合ポートフォリオ一覧サイト。データの正本は Neon Postgres の `portfolio_items` テーブルで、サイトは `/api/portfolio-items` 経由でDBから取得する。`gallery/data.js` はDB取得に失敗したときのオフラインフォールバックとしてのみ残している（`node gallery/scripts/sync-data-js.mjs` で再生成できる）。

2026-07-16に、旧`landing_pages`テーブル（LP専用サイト`gallery/`）と旧`websites`テーブル（HP専用サイト`gallery-hp/`）を`portfolio_items`テーブルに統合し、`gallery/`を唯一のポートフォリオギャラリーとした。`gallery-hp/`は非推奨（dormant）。旧テーブル自体はロールバック用に削除せず残してある。詳細は`skills/design/hp-gallery-sync/SKILL.md`を参照。

## 標準運用（2026-07-10からユーザー承認済み。統合後も踏襲）

新しいLP・HP等をVercelに本番公開、またはバナー等の静止画を納品したら、**都度確認を取らずに**このスキルの手順でギャラリーへ登録・再公開する。ただし、登録対象・スラッグが曖昧な場合や、スキーマ変更などの破壊的操作は通常どおり確認する。

## typeとlink_typeの対応

| type | 内容 | link_type | カードクリック時の挙動 |
|---|---|---|---|
| `lp` | 1枚絵ラスターLP | `external` | 実サイトをiframeプレビュー |
| `hp` | Next.jsコーポレートサイト | `external` | 実サイトをiframeプレビュー |
| `moving-lp` | Remotion動くLP | `external` | 実サイトをiframeプレビュー |
| `swipe-lp` | 縦スワイプ型LP | `external`（`featureTags`に`"スワイプ"`を含めるとスマホ表示固定になる） | 実サイトをiframeプレビュー（スマホ固定） |
| `banner` | 広告バナー | `image` | 画像を拡大表示（ライトボックス） |
| `thumbnail` | サムネイル | `image` | 画像を拡大表示（ライトボックス） |
| `sns-post` | SNS投稿画像 | `image` | 画像を拡大表示（ライトボックス） |
| `flyer` | チラシ | `image` | 画像を拡大表示（ライトボックス） |

## 前提・秘密情報

- DB接続情報（`DATABASE_URL`）は Vercelプロジェクト `lp-portfolio-gallery` の環境変数（production/preview/development）に設定済み。ローカルでは `gallery/.env`（Git管理外）に保存する。
- `gallery/.env` が無い場合は `cd gallery && npx vercel env pull .env --yes` で取得する。
- `.env`、接続文字列、パスワードをチャット出力やコミットに含めない。

## 手順

1. 対象がVercel本番公開済みであることを確認する（`external`系タイプ。未公開なら `skills/lp-design/vercel-free-deploy/SKILL.md` に従って先に公開する）。`image`系タイプ（バナー/サムネ/SNS投稿/チラシ）はVercel公開不要で、書き出した画像ファイルがあればよい。
2. サムネイルを用意する。
   - `external`系: `node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> gallery/assets/thumbnails/<slug>.jpg`
   - `image`系: 元画像をそのまま or `sips`で圧縮してJPEG化する。元画像本体は `gallery/assets/portfolio/<type>/<slug>.png` 等に配置し、`url`にそのパスを指定する。
     ```bash
     sips -s format jpeg -Z 1000 <元画像> --out gallery/assets/thumbnails/<slug>.jpg
     ```
3. エントリJSONを作る（既存カテゴリ・タグを優先して再利用し、フィルタが際限なく増えないようにする。既存の値は `portfolio_items` をSELECTするか `gallery/data.js` を参照）。
   ```json
   {
     "slug": "<一意なslug>",
     "type": "lp|hp|moving-lp|swipe-lp|banner|thumbnail|sns-post|flyer",
     "title": "<作品タイトル>",
     "heading": "<キャッチコピー・見出し（imageタイプで無ければnullでも可）>",
     "category": "<カテゴリ1つ>",
     "moodTags": ["雰囲気タグ1", "雰囲気タグ2"],
     "productTags": ["商品タグ1", "商品タグ2"],
     "featureTags": ["機能タグ1"],
     "linkType": "external または image（省略時external）",
     "url": "<external: Vercel本番URL / image: gallery/からの相対パス>",
     "thumbnail": "assets/thumbnails/<slug>.jpg"
   }
   ```
4. DBへ登録・更新する（slugが既存なら上書き更新、新規ならINSERTされる）。
   ```bash
   node gallery/scripts/add-portfolio-item.mjs <entry.json>
   ```
5. `gallery/data.js` のフォールバックを最新化する（DBが正本、フォールバックは手動同期が必要）。
   ```bash
   cd gallery && node scripts/sync-data-js.mjs
   ```
6. ギャラリーサイトを再公開する。
   ```bash
   cd gallery && npx vercel --prod --yes
   ```
7. 公開後検証する。
   ```bash
   curl -I https://lp-portfolio-gallery.vercel.app/
   curl -sS https://lp-portfolio-gallery.vercel.app/api/portfolio-items | node -e '...'  # 件数と新規slugの有無を確認
   ```
   `external`系は作品自体のURLも `curl -I` でHTTP 200を確認する。

## 関連ファイル

- スキーマ: `gallery/db/portfolio-schema.sql`（`portfolio_items`テーブル）。旧スキーマ`gallery/db/schema.sql`（`landing_pages`）は参照用に残置。
- API: `gallery/api/portfolio-items.js`（DBから取得しJSON返却）。旧`gallery/api/landing-pages.js`も残置（互換用、新規登録には使わない）。
- フロント: `gallery/index.html`（タイプタブ+画像ライトボックス追加済み） / `gallery/script.js` / `gallery/data.js`（フォールバック）
- 登録スクリプト: `gallery/scripts/add-portfolio-item.mjs`（1件upsert）, `gallery/scripts/sync-data-js.mjs`（DB→data.js再生成）, `gallery/scripts/db.mjs`（DB接続共通処理・`upsertPortfolioItem`）

## 既存エントリの削除・一括更新

削除やカテゴリ一括変更など、SELECT/UPDATE/DELETEが必要な場合は `gallery/scripts/db.mjs` の `sql` をimportして直接SQLを書くか、Neonコンソール（`console.neon.tech`）のSQL Editorを使う。破壊的なSQL（DELETE/DROP等）を実行する前は、対象件数を確認し、ユーザーに一度提示する。

## 失敗時の切り分け

- `DATABASE_URL が設定されていません`: `gallery/.env` が無い/空。`npx vercel env pull .env --yes` を `gallery/` で実行する。
- `/api/portfolio-items` が500やエラーJSONを返す: Vercel側の環境変数が古い/未設定の可能性。`npx vercel env ls` で確認する。
- ギャラリーの表示件数が増えない: ブラウザ/CDNキャッシュ（`Cache-Control: s-maxage=60`）の可能性。60秒待つか強制リロードして確認する。
- 新しいタイプタブが空のまま: そのtypeのエントリがまだ`portfolio_items`に無いだけ。手順どおり登録すれば表示される。
