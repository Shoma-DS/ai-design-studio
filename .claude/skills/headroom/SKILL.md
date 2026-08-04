---
name: headroom
description: Headroom（トークン圧縮プロキシ）の導入・自動起動設定・状態確認・削減率チェック・一時無効化・解除を行う。「ヘッドルームを入れて」「Headroomが効いてるか確認して」「トークン削減どれくらい？」「Headroomを切って」と言われたときに使う。
---

# Headroom 運用スキル

Headroom（github.com/chopratejas/headroom, Apache-2.0）は Claude Code のリクエストをローカルプロキシ経由にしてコンテキストを圧縮するツール。このリポジトリの共通運用として、各自の環境に導入できるようにしてある。

**重要な前提:** 導入先はすべて個人環境（`~/.local/bin`、`~/.zshrc`、`~/.claude/`）で、リポジトリには設定を書き込まない。導入は各自の任意で、入れていないメンバーの Claude Code に影響しない。

## セッション開始時の自動チェック

`.claude/settings.json` の SessionStart フックが `scripts/session-start.sh` を実行し、セッション開始のたびに次を自動で行う。

| 状態 | 動作 |
| --- | --- |
| Headroom 導入済み・経由中 | 何も表示しない。プロキシが落ちていれば自動で起動 |
| 導入済みだが経由していない | 「ターミナルから `claude` で起動を」と1行案内。プロキシは起動しておく |
| 未導入 | 「有効化: `bash .claude/skills/headroom/scripts/setup-headroom.sh`」と1行案内 |
| `~/.claude/.headroom-optout` がある | 常に何も表示しない |

このフックは案内とプロキシ起動だけで、ソフトの導入や設定ファイルの書き換えは一切しない。通知が不要なメンバーは `touch ~/.claude/.headroom-optout` で黙らせられる。

## 導入する

```bash
bash .claude/skills/headroom/scripts/setup-headroom.sh
```

やること:

1. `headroom` が無ければ pipx で導入（`headroom-ai[all]`、Python 3.12 を優先）
2. `~/.zshrc`（bash なら `~/.bashrc`）へ `claude()` 関数を追記し、`claude` を自動で `headroom wrap claude` に委譲させる

何度実行しても重複追記しない。追記前に rc ファイルのバックアップを取る。反映は**次にターミナルを開いたときから**。

`claude()` 関数の分岐:

| 条件 | 実行されるもの |
| --- | --- |
| 通常 | `headroom wrap claude "$@"`（プロキシ起動 → Claude Code 起動） |
| `ANTHROPIC_BASE_URL` が既にある | `command claude`（Headroom セッション内での入れ子起動を回避） |
| `NO_HEADROOM=1` | `command claude`（素の Claude Code） |
| `headroom` が無い | `command claude`（フォールバック） |

正常に経由できていれば起動時に `HEADROOM WRAP: CLAUDE` のバナーと `ANTHROPIC_BASE_URL=http://127.0.0.1:8787` が出る。

対話シェル専用の設定なので、Claude Code のデスクトップアプリや IDE 拡張から起動した場合は経由しない。

## 状態を確認する

```bash
headroom doctor
```

- `proxy` が `✓ pass` … ローカルプロキシ稼働中
- `wrap_marker` が `live wrap session` … 今のセッションが Headroom 経由
- `claude` の `⚠ not routed` は「`~/.claude/settings.json` に恒久設定を書いていない」という意味。ラップ方式では正常なので直さなくてよい
- `budget` の警告も未設定なだけで問題ではない

今のセッションだけ見るなら `echo $ANTHROPIC_BASE_URL` が `http://127.0.0.1:8787` かどうか。

## 起動し直したいとき

セッションの途中から有効化することはできない（環境変数は起動時に決まる）。ユーザーには「一度終了して、ターミナルで `claude`」と案内する。プロキシだけ先に上げるなら `headroom proxy`（ポート 8787）。

## 削減率を見る

```bash
headroom savings        # 累積の圧縮節約
headroom perf           # ログからの性能分析
headroom output-savings
headroom dashboard      # ブラウザでダッシュボード
```

トラフィックが溜まるまで 0 表示になる。実力値はコーディング用途で 15〜20% 程度。README の「95%削減」は JSON データ処理のケース。

## 一時的に切る / 完全に外す

```bash
NO_HEADROOM=1 claude    # そのセッションだけ素の Claude Code
```

Remote Control（`/rc`）は `ANTHROPIC_BASE_URL` が独自エンドポイントを指していると Claude Code 側の仕様で無効化される。`/rc` を使うセッションは `NO_HEADROOM=1 claude` で起動する。

完全に外す場合:

1. `~/.zshrc` の `# >>> headroom auto-wrap >>>` 〜 `# <<< headroom auto-wrap <<<` ブロックを削除
2. `headroom unwrap claude`

## Codex はラップしない（既定）

`headroom wrap codex` も存在するが、このリポジトリでは使わない。

- Codex の用途が画像生成（`server/codexImageClient.mjs` が `codex app-server --listen stdio://` を spawn し gpt-image-2 を呼ぶ）にほぼ限られ、長い会話コンテキストが無いので圧縮の効果が小さい。
- `wrap codex` は `~/.codex/config.toml` へ Headroom プロバイダを**永続的に**書き込む。ラップしたセッションだけでなく、リポジトリの画像生成を含む全 Codex 実行が影響を受け、LP・バナー・サムネの制作フローが止まるリスクがある。
- `headroom wrap codex --learn` は学習結果を共有ファイル **AGENTS.md** へ書き込む。

試すなら、まず `codex app-server` 経由の画像生成が通ることを確認してから。壊れた場合は `~/.codex/config.toml` の Headroom プロバイダ節を削除すれば戻る。

## 禁止事項

- **共有 `.claude/settings.json` に `ANTHROPIC_BASE_URL` を書かない。** Headroom を入れていないメンバーの Claude Code が、起動しないローカルプロキシへ接続しにいって全滅する。ルーティングは各自のシェル設定で行う。
- `headroom wrap claude --learn` と `--serena-instructions` は使わない。`MEMORY.md` や `AGENTS.md` など共有ファイルへ書き込む可能性がある。
- `.serena/` `.headroom/` `.claude/.headroom_wrap_marker.json` は Headroom が作るローカル作業ファイル。共有 `.gitignore` ではなく各自の `.git/info/exclude` で除外する（このリポジトリでは登録済み）。

## トラブル時

| 症状 | 対処 |
| --- | --- |
| Claude Code が API エラーで起動しない | `headroom doctor` → プロキシが落ちていれば `headroom proxy`。切り分けは `NO_HEADROOM=1 claude` |
| 1M コンテキストが効かない | `headroom wrap claude --1m` で明示的に維持。`/status` のモデル表示で確認 |
| Serena MCP がスキップされる | `uvx` 未導入。コード検索MCPが要るなら `brew install uv`。圧縮本体には影響しない |
| バージョンずれ | `headroom update` → プロキシ再起動 |
