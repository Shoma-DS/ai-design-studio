#!/bin/zsh
# Vercelへ静的LPを公開する。

set -euo pipefail

PROJECT_DIR="/Users/deguchishouma/Desktop/lp-design"
LP_DIR="${PROJECT_DIR}/projects/ai-income-course/ver01-fresh-green/lp"

cd "$LP_DIR"

echo "Deploy source: ${LP_DIR}"

if [[ -n "${LP_VERCEL_COMMAND:-}" ]]; then
  echo "Command: ${LP_VERCEL_COMMAND}"
  zsh -lc "$LP_VERCEL_COMMAND"
else
  echo "Command: npx vercel --prod --yes"
  npx vercel --prod --yes
fi
