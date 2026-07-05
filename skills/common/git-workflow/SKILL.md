---
name: git-workflow
description: AI Design Studio の Git 運用。差分確認、日本語コミット、明示承認後の push、push 後の Discord 自動通知を扱う。
---

# Git ワークフロー

このスキルは `ai-design-studio` リポジトリで Git 操作を行うときに使う。
push はユーザーが明示した場合だけ行う。自動 pull、未確認の破壊的操作、秘密情報の共有はしない。

## 対象

- コミットだけ行う。
- ユーザー承認後にコミットして `origin/main` へ push する。
- LP画像、LP原稿、画像プロンプト、編集GUIの差分を確認する。
- Xserver や Vercel 公開前後の差分と状態を確認する。
- push 後の Discord 通知状態を確認する。

## 事前確認

1. `git status --short --branch` でブランチと変更状態を確認する。
2. `git diff --staged` と `git diff` で差分を確認する。
3. 画像差し替えがある場合は、対象ファイル名とサイズが意図通りか見る。
4. `.env`、`.vercel/`、秘密情報ファイルが含まれていないことを確認する。
5. コミット前にユーザーへ変更内容とコミットメッセージ案を提示する。
6. ユーザー承認があるまで `git commit` は実行しない。

## コミットメッセージ

必ず日本語で、次の形にする。

```text
<1行目: 簡潔な内容>

<3行目以降: 詳細>
```

詳細は 3〜5 行を目安にする。

## 書き方のルール

- 1行目は短く、何をしたかが一目で分かる言葉にする。
- 2行目は空行にする。
- 3行目以降に、どこを変えたか、何を足したか、何が良くなるかを書く。
- 変更したファイル名やフォルダ名をできるだけ入れる。
- 難しい専門用語だけで終わらせない。
- 自分ひとりで運用する前提なので、ブランチ分岐や PR 作成は通常使わない。

## 例

```text
LP編集GUIを追加

src/App.jsx に3分割の編集画面を作った。
server/lpStore.mjs で原稿と画像を保存できるようにした。
セクションごとに画像差し替えとXserver公開を進められる。
```

## コミット前説明

コミット前に、次の形でユーザーへ確認する。

```text
<1行での要約>

全体像:
<この変更が何のためか>
<何ができるようになるか>

変更したファイル:
- <ファイル名>: <変えた内容>
- <ファイル名>: <変えた内容>

コミットメッセージ案:
<1行目>

<詳細>

この内容でコミットしてよいですか？
```

承認があるまで `git commit` は実行しない。

## Push

push が必要な場合だけ行う。

1. `git status --short --branch` で未コミット変更がないことを確認する。
2. 通常は `git push origin main` を実行する。
3. 成功したら、push したブランチと最新コミットを短く伝える。
4. push 後に GitHub Actions の `Discord Push Notify` が実行されることを確認する。
5. 通知に失敗した場合は、Secret `DISCORD_WEBHOOK` の設定と Actions のログを確認する。

## Discord 通知

- Discord Webhook URL は GitHub Secret `DISCORD_WEBHOOK` に保存する。
- Webhook URL を `.env`、ドキュメント、コミットメッセージ、チャット本文に貼らない。
- push 通知は `.github/workflows/discord-push-notify.yml` が送信する。
- エージェントは Discord へ手動投稿しない。push 後の通知は GitHub Actions に任せる。

## 公開との関係

- Xserver や Vercel 公開の前に、未保存・未コミットの変更があるか確認する。
- 公開だけを急ぐ場合でも、どのファイルが未コミットかをユーザーに伝える。
- `airth-ai.jp` の公開元と公開先が意図通りか確認する。
- Xserver の API キー、FTP/SSH 接続情報、秘密鍵、`.env` は共有しない。リポジトリに入れない。
- Vercel 公開はユーザーが明示した場合だけ扱い、`.vercel/` は共有しない。
