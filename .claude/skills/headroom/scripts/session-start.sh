#!/usr/bin/env bash
# SessionStart フック。Headroom（トークン圧縮プロキシ）の状態を見て、
# 必要ならプロキシを起動し、経由していない場合だけ短い案内を出す。
# 何も導入・変更しない。通知が不要な人は  touch ~/.claude/.headroom-optout  で黙らせられる。
set -uo pipefail

PORT="${HEADROOM_PORT:-8787}"
OPTOUT="$HOME/.claude/.headroom-optout"

emit() { printf '{"suppressOutput":true,"systemMessage":%s}\n' "$1"; exit 0; }
quiet() { printf '{"suppressOutput":true}\n'; exit 0; }

[ -f "$OPTOUT" ] && quiet

HB="$(command -v headroom 2>/dev/null || true)"
[ -z "$HB" ] && [ -x "$HOME/.local/bin/headroom" ] && HB="$HOME/.local/bin/headroom"

# 1. 未導入 → 有効化の案内だけ
if [ -z "$HB" ]; then
  emit '"Headroom（トークン圧縮）が未導入です。有効化: bash .claude/skills/headroom/scripts/setup-headroom.sh ／ 通知不要なら touch ~/.claude/.headroom-optout"'
fi

# 2. プロキシが落ちていれば起動（バックグラウンド、待たない）
if ! curl -s -m 1 -o /dev/null "http://127.0.0.1:${PORT}/stats" 2>/dev/null; then
  nohup "$HB" proxy --port "$PORT" >/dev/null 2>&1 &
  disown 2>/dev/null || true
fi

# 3. このセッションが経由しているか
case "${ANTHROPIC_BASE_URL:-}" in
  *"127.0.0.1:${PORT}"*|*"localhost:${PORT}"*) quiet ;;
esac

emit '"このセッションは Headroom を経由していません。ターミナルから claude で起動すると圧縮が効きます（デスクトップアプリ／IDE からの起動は対象外）。"'
