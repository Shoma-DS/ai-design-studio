---
name: vercel-free-deploy
description: LPや静的WebサイトをVercelのHobby/free枠を無料サーバー候補として公開・更新・検証する運用。Use when the user wants to deploy an LP, portfolio page, static HTML, Vite/Next app, or generated design site to Vercel for free/preview hosting, configure Vercel CLI, GitHub Actions secrets, VERCEL_TOKEN/VERCEL_ORG_ID/VERCEL_PROJECT_ID, production deployments, preview deployments, domains, or Vercel publish troubleshooting.
---

# Vercel Free Deploy

このスキルは、Vercelを「無料で使える可能性がある公開先」として扱い、LPや静的サイトを公開前確認、Vercel設定、デプロイ、公開後検証まで進めるために使う。
Vercel公開は外部サービス操作なので、ユーザーが公開・デプロイを明示した場合だけ実行する。

## 前提

- Hobby/free枠は個人・小規模公開向けとして扱う。商用、チーム利用、大量アクセス、独自ドメイン移管、課金が絡む可能性がある場合は、作業前にVercel公式の最新プラン・制限を確認する。
- 2026-07時点の公式情報では、Hobby plan は無料で、CLI/Git連携、CI/CD、自動HTTPS/SSL、Git pushごとのPreview Deployments、100GB Fast Data Transferなどを含む。ただし無料枠超過時はHobbyのデプロイが停止される。
- Vercelの料金・制限・商用可否は変わるため、ユーザーに「完全無料で永久に使える」と断定しない。
- 本番URLを公開する前に、ローカルプレビューで表示崩れ、画像パス、リンク、CTA、スマホ幅を確認する。

## 秘密情報

- `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`、GitHub token、`.env*`、`.vercel/` はGitに追加しない。
- Secret値を端末出力、チャット、コミット、スクリーンショットに出さない。
- GitHub ActionsでVercel公開する場合は GitHub Secrets に次を登録する。
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
- ローカルCLIでは `vercel login` または既存のVercel CLI認証を使う。`.vercel/project.json` はプロジェクト紐付け情報なので、公開リポジトリへ含める前にリポジトリ方針を確認する。このリポジトリでは `.vercel/` を共有しない。

## 公開元の決め方

1. ユーザーが対象を指定している場合は、そのLP/siteフォルダを公開元にする。
2. 指定がないLP制作の場合は、`projects/<client>/<project-name>/lp/` または `portfolio/<project-name>/lp/` の `index.html` があるフォルダを候補にする。
3. `npm run publish:vercel` を使う前に、必ず `scripts/publish-vercel.sh` の `LP_DIR` や `LP_VERCEL_COMMAND` が意図した公開元を指しているか確認する。
4. スクリプトが別リポジトリや別案件を指している場合は使わず、対象フォルダで直接 `npx vercel` を実行するか、ユーザー承認後にスクリプトを修正する。

## 事前確認

1. `git status --short --branch` で未コミット変更を把握する。ユーザーの変更は勝手に戻さない。
2. 公開元に `index.html` があるか確認する。Vite/Nextなどのアプリなら `package.json` と build script を確認する。
3. `.env`、`.vercel/`、秘密鍵、token、credentialがGit差分に含まれていないことを確認する。
4. LPならローカルで開くかdev serverを起動し、画像、CSS、リンク、フォーム、CTA、スマホ表示を確認する。
5. 無料枠の範囲で問題ないか確認する。商用・高トラフィック・チーム運用なら、Vercel公式の最新Plan/Limitを確認してユーザーへ判断材料を出す。

## ローカルCLI公開

ユーザーが「Vercelに公開して」と明示した場合だけ実行する。

```bash
cd <公開元フォルダ>
npx vercel --yes
```

Preview URLで問題なければ、本番公開する。

```bash
cd <公開元フォルダ>
npx vercel --prod --yes
```

このリポジトリの既存スクリプトを使う場合は、公開元が合っていることを確認してから実行する。

```bash
npm run publish:vercel
```

## GitHub Actions公開

ユーザーがCI公開、GitHub Actions、自動デプロイを求めた場合に使う。

1. GitHub Secrets に `VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID` があるか `gh secret list -R <owner/repo>` で名前だけ確認する。
2. 無ければ、値を表示せずに `gh secret set` で登録する。
3. workflowでは `vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}`、`vercel build --prod --token=...`、`vercel deploy --prebuilt --prod --token=...` の流れを基本にする。
4. workflowファイルを追加・編集した場合は、ユーザー承認があるまでコミットしない。

## 公開後検証

1. Vercel CLIの出力からPreview URLまたはProduction URLを控える。
2. ブラウザまたは `curl -I <URL>` でHTTP 200、HTTPS、リダイレクトを確認する。
3. LPならファーストビュー、画像読み込み、CTAリンク、レスポンシブ表示を確認する。
4. 必要なら `LP_PUBLIC_URL` をローカルの未追跡 `.env.local` などへ保存する。Git追跡ファイルに秘密情報は書かない。
5. 公開URL、実行コマンド、検証結果、残リスクをユーザーへ簡潔に報告する。

## 失敗時の切り分け

- `vercel: command not found`: `npx vercel` を使う。依存インストールやログインが必要ならユーザー承認を取る。
- `No Output Directory`: 静的HTMLなら公開元フォルダを間違えていないか確認する。Vite/Nextならbuild設定とoutput directoryを確認する。
- `Project not linked`: `vercel link` または `.vercel/project.json` を使う。ただし `.vercel/` はGitに追加しない。
- `401/403`: `VERCEL_TOKEN`、ログイン状態、team/org、GitHub Secretsの登録先リポジトリを確認する。値は表示しない。
- `404` や画像欠落: 相対パス、ファイル名の大文字小文字、公開元フォルダ、`index.html` からの参照先を確認する。
- 無料枠や課金関連の警告: 作業を止め、公式のPlan/Limitと表示内容をユーザーへ要約して判断を仰ぐ。

## ギャラリーサイトへの追加

公開したLPは `gallery/`（ポートフォリオギャラリーサイト、`lp-portfolio-gallery`としてVercel公開済み）に必ず追加する。LPをVercel本番公開したら、次を行う。

1. `node scripts/generate-thumbnail.mjs <lp/index.htmlへのパス> gallery/assets/thumbnails/<slug>.jpg` でサムネイルを生成する。
2. `gallery/data.js` の配列に、次のスキーマでエントリを追加する。
   ```js
   {
     slug: "<プロジェクトフォルダのslug>",
     title: "<lp/index.htmlの<title>>",
     heading: "<コピー原稿のキャッチコピー・見出し>",
     category: "<カテゴリ1つ>",
     tags: ["タグ1", "タグ2", "タグ3"],
     url: "<vercelの本番URL>",
     thumbnail: "assets/thumbnails/<slug>.jpg"
   }
   ```
   カテゴリは既存エントリで使っているものを優先して再利用し、フィルタが際限なく増えないようにする。
3. `cd gallery && npx vercel --prod --yes` でギャラリーサイトを再公開する。
4. `curl -I` で新しいLPと更新後のギャラリーサイト、両方のHTTP 200を確認する。

## 公式参照

- Vercel Plans: `https://vercel.com/docs/plans`
- Vercel Limits: `https://vercel.com/docs/limits`
- Vercel CLI deploy: `https://vercel.com/docs/cli/deploy`
- Vercel Git deployments: `https://vercel.com/docs/git`
