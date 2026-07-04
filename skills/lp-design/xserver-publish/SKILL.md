---
name: xserver-publish
description: LPデザインリポジトリでXserverのairth-ai.jpへLPを公開・更新する運用。Use when the user wants to deploy, publish, update, verify, or migrate the LP from Vercel to Xserver, especially for airth-ai.jp, XServer CLI, SSH, SFTP, rsync, domain settings, SSL settings, or public_html uploads.
---

# Xserver Publish

このスキルは `airth-ai.jp` を Xserver 上の標準公開先として扱い、LPの公開前確認、Xserver設定確認、静的ファイルアップロードを進めるために使う。
Vercelはユーザーが明示した場合だけ扱う。

## 正本

- 公開ドメイン: `airth-ai.jp`
- 公開URL: `https://airth-ai.jp/`
- 公開元: `projects/ai-income-course/ver01-fresh-green/lp/`
- 主要ファイル: `index.html`, `images/lp-full.png`, `images/`
- Xserver公開先: `airth-ai.jp/public_html/`
- `scripts/publish-xserver.sh` はローカルの `.env.local` を読み込む。
- 公開コマンド: `npm run publish:xserver` で dry-run、`npm run publish:xserver -- --apply` で実アップロード

## 秘密情報

- `XSERVER_API_KEY`、FTP/SSHユーザー名、パスワード、秘密鍵、サーバーID、接続ホストはリポジトリへ書かない。
- 接続情報はローカル環境変数、ローカルの shell profile、または未追跡の `.env.local` だけで扱う。
- `.env*`、`.vercel/`、秘密鍵、Xserver設定ファイルを Git に追加しない。

## 初回設定確認

1. Xserverで `airth-ai.jp` のドメイン設定が追加済みか確認する。
2. 無料独自SSLが有効か、または設定中か確認する。
3. DNS/ネームサーバー反映が済んでいるか確認する。
4. `airth-ai.jp/public_html/` に既存ファイルがある場合、削除や上書きの前にユーザーへ確認する。
5. SSHを使う場合は、公開鍵認証、ポート `10022`、国外アクセス制限の状態を確認する。

## XServer CLIの使い方

- XServer CLIは、ドメイン、SSL、SSH、FTPアカウントなどの設定確認・変更に使う。
- CLI利用には Node.js v18以上と Xserver APIキーが必要。
- 必要なら `npm install -g xserver-cli` または `npx xserver-cli ...` で使う。
- 通常は `xserver auth login` で認証し、`xserver auth status` で状態を確認する。
- 自動化では `XSERVER_API_KEY` と `XSERVER_SERVERNAME` を環境変数で渡せるが、値をファイルへ記録しない。
- 公式CLIに静的ファイル配信機能が確認できない限り、LPファイルのアップロードは SSH/SFTP/rsync で行う。

## 公開手順

1. `git status --short --branch` で未コミット変更を確認する。
2. `projects/ai-income-course/ver01-fresh-green/lp/index.html` と `images/lp-full.png` が存在することを確認する。
3. フロントエンドやサーバーを変更した場合は `npm run build` を実行する。
4. `npm run publish:xserver` で dry-run し、転送元、転送先、ファイル一覧を確認する。
5. ユーザーが本番反映を求めている場合だけ `npm run publish:xserver -- --apply` を実行する。
6. 公開後に `https://airth-ai.jp/` をブラウザで確認する。

## ローカル環境変数

`scripts/publish-xserver.sh` は次の値を使う。

```text
XSERVER_DEPLOY_HOST=example.xsrv.jp
XSERVER_DEPLOY_USER=server-user
XSERVER_DEPLOY_PORT=10022
XSERVER_DEPLOY_KEY=/path/to/private-key
XSERVER_DEPLOY_REMOTE_DIR=airth-ai.jp/public_html
LP_SOURCE_DIR=projects/ai-income-course/ver01-fresh-green/lp
LP_PUBLIC_URL=https://airth-ai.jp/
```

`XSERVER_DEPLOY_HOST` と `XSERVER_DEPLOY_USER` は必須。
`XSERVER_DEPLOY_PORT` は未指定なら `10022`、`XSERVER_DEPLOY_REMOTE_DIR` は未指定なら `airth-ai.jp/public_html` を使う。

## 公式参照

- XServer CLI: `https://developer.xserver.ne.jp/cli/server/`
- XServer API: `https://www.xserver.ne.jp/manual/man_tool_api.php`
- ドメイン設定: `https://www.xserver.ne.jp/manual/man_domain_setting.php`
- FTPアップロード先: `https://www.xserver.ne.jp/manual/man_ftp_setting.php`
- SSH設定: `https://www.xserver.ne.jp/manual/man_server_ssh.php`
