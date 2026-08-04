#!/usr/bin/env bash
# Headroom（トークン圧縮プロキシ）を個人環境へ導入し、claude を自動ラップする。
# 何度実行しても安全（冪等）。リポジトリ側のファイルは一切変更しない。
set -euo pipefail

BEGIN_MARK="# >>> headroom auto-wrap >>>"
END_MARK="# <<< headroom auto-wrap <<<"

case "$(basename "${SHELL:-/bin/zsh}")" in
  bash) RC="$HOME/.bashrc" ;;
  *)    RC="$HOME/.zshrc" ;;
esac

echo "==> シェル設定: $RC"

# 1. headroom 本体
if command -v headroom >/dev/null 2>&1; then
  echo "==> headroom 導入済み: $(headroom --version 2>/dev/null || echo '不明')"
else
  echo "==> headroom が見つかりません。pipx で導入します"
  if ! command -v pipx >/dev/null 2>&1; then
    echo "!! pipx がありません。先に導入してください:  brew install pipx && pipx ensurepath" >&2
    exit 1
  fi
  # Python 3.14 は wheel 事情が読めないため 3.12 を優先する
  PY="$(command -v python3.12 || true)"
  if [ -n "$PY" ]; then
    pipx install --python "$PY" "headroom-ai[all]"
  else
    pipx install "headroom-ai[all]"
  fi
fi

# 2. シェル関数の追記（既にあれば何もしない）
if grep -qF "$BEGIN_MARK" "$RC" 2>/dev/null; then
  echo "==> 自動ラップ設定は既に $RC にあります（スキップ）"
else
  cp "$RC" "$RC.bak-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || touch "$RC"
  cat >> "$RC" <<'EOF'

# >>> headroom auto-wrap >>>
# claude を常に Headroom（トークン圧縮プロキシ）経由で起動する。
# 素の claude に戻すには NO_HEADROOM=1 claude / command claude
claude() {
  if [[ -n "$NO_HEADROOM" ]]; then
    command claude "$@"
  elif [[ -n "$ANTHROPIC_BASE_URL" ]]; then
    # すでに Headroom セッション内。入れ子で wrap しない
    command claude "$@"
  elif command -v headroom >/dev/null 2>&1; then
    headroom wrap claude "$@"
  else
    command claude "$@"
  fi
}
# <<< headroom auto-wrap <<<
EOF
  echo "==> $RC に自動ラップ設定を追記しました（バックアップ: $RC.bak-*）"
fi

echo
echo "完了。新しいターミナルを開いて 'claude' を実行すると HEADROOM WRAP のバナーが出ます。"
echo "状態確認: headroom doctor   /   解除: $RC の $BEGIN_MARK ブロックを削除"
