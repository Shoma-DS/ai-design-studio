#!/bin/zsh
# lp-design — LP Section Studio をローカル起動し、公開は Vercel へ送る

PROJECT_DIR="/Users/deguchishouma/Desktop/lp-design"
PORT=5177
PID_FILE="/tmp/lp-design-server.pid"
LOG_FILE="/tmp/lp-design-server.log"
PUBLIC_LP_PATH="projects/ai-income-course/ver01-fresh-green/lp/index.html"

cd "$PROJECT_DIR"

# ─── サーバー起動 ────────────────────────────────────────────
if lsof -ti :$PORT > /dev/null 2>&1; then
  echo "✓ サーバーはすでに起動中です (port: $PORT)"
else
  echo "▶ LP Section Studio を起動しています..."
  npm run dev > "$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo $SERVER_PID > "$PID_FILE"

  # 最大5秒待ってポートが開くまで確認
  for i in {1..10}; do
    sleep 0.5
    if lsof -ti :$PORT > /dev/null 2>&1; then
      echo "✓ サーバー起動完了 (PID: $SERVER_PID, port: $PORT)"
      break
    fi
    if [[ $i -eq 10 ]]; then
      echo "⚠ サーバーの起動確認がタイムアウトしました"
      echo "  ログ: $LOG_FILE"
    fi
  done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ローカル: http://127.0.0.1:${PORT}"
echo "  公開元: ${PUBLIC_LP_PATH}"
echo "  公開: GUI右上の「Vercelに公開」または npm run publish:vercel"
echo "  ngrok は起動しません"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
