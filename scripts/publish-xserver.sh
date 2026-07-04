#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

LP_SOURCE_DIR="${LP_SOURCE_DIR:-projects/ai-income-course/ver01-fresh-green/lp}"
LP_PUBLIC_URL="${LP_PUBLIC_URL:-https://airth-ai.jp/}"
XSERVER_DEPLOY_PORT="${XSERVER_DEPLOY_PORT:-10022}"
XSERVER_DEPLOY_REMOTE_DIR="${XSERVER_DEPLOY_REMOTE_DIR:-airth-ai.jp/public_html}"

APPLY=0
DELETE_REMOTE=0

usage() {
  cat <<'USAGE'
Usage: npm run publish:xserver -- [--apply] [--delete] [--help]

Defaults to dry-run. Set these environment variables locally:
  XSERVER_DEPLOY_HOST        Required. SSH host, e.g. xs123456.xsrv.jp
  XSERVER_DEPLOY_USER        Required. SSH user/server account
  XSERVER_DEPLOY_PORT        Optional. Defaults to 10022
  XSERVER_DEPLOY_KEY         Optional. Private key path
  XSERVER_DEPLOY_REMOTE_DIR  Optional. Defaults to airth-ai.jp/public_html
  LP_SOURCE_DIR              Optional. Defaults to projects/ai-income-course/ver01-fresh-green/lp
  LP_PUBLIC_URL              Optional. Defaults to https://airth-ai.jp/

Options:
  --apply   Upload files for real
  --delete  Delete remote files that do not exist locally; only with --apply
  --help    Show this help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      APPLY=1
      ;;
    --delete)
      DELETE_REMOTE=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

SOURCE_PATH="$PROJECT_ROOT/$LP_SOURCE_DIR"

if [[ ! -d "$SOURCE_PATH" ]]; then
  echo "Source directory not found: $SOURCE_PATH" >&2
  exit 1
fi

if [[ ! -f "$SOURCE_PATH/index.html" ]]; then
  echo "index.html not found in source directory: $SOURCE_PATH" >&2
  exit 1
fi

if [[ ! -f "$SOURCE_PATH/images/lp-full.png" ]]; then
  echo "images/lp-full.png not found in source directory: $SOURCE_PATH" >&2
  exit 1
fi

if [[ -z "${XSERVER_DEPLOY_HOST:-}" || -z "${XSERVER_DEPLOY_USER:-}" ]]; then
  echo "XSERVER_DEPLOY_HOST and XSERVER_DEPLOY_USER are required." >&2
  usage >&2
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required." >&2
  exit 1
fi

SSH_ARGS=(-p "$XSERVER_DEPLOY_PORT")
if [[ -n "${XSERVER_DEPLOY_KEY:-}" ]]; then
  SSH_ARGS+=(-i "$XSERVER_DEPLOY_KEY")
fi

SSH_COMMAND="ssh"
for ssh_arg in "${SSH_ARGS[@]}"; do
  printf -v quoted_ssh_arg '%q' "$ssh_arg"
  SSH_COMMAND+=" $quoted_ssh_arg"
done

REMOTE="${XSERVER_DEPLOY_USER}@${XSERVER_DEPLOY_HOST}:${XSERVER_DEPLOY_REMOTE_DIR%/}/"
RSYNC_ARGS=(
  -az
  --human-readable
  --progress
  --exclude='.DS_Store'
  --exclude='.gitignore'
  --exclude='.vercel/'
  --exclude='*.md'
  --exclude='copy/'
  --exclude='cta-button-preview.html'
)

if [[ "$APPLY" -eq 0 ]]; then
  RSYNC_ARGS+=(--dry-run)
fi

if [[ "$DELETE_REMOTE" -eq 1 ]]; then
  if [[ "$APPLY" -eq 0 ]]; then
    echo "--delete requires --apply." >&2
    exit 2
  fi
  RSYNC_ARGS+=(--delete)
fi

echo "Source: $SOURCE_PATH/"
echo "Remote: $REMOTE"
echo "Public URL: $LP_PUBLIC_URL"
if [[ "$APPLY" -eq 0 ]]; then
  echo "Mode: dry-run"
else
  echo "Mode: apply"
fi

if [[ "$APPLY" -eq 1 ]]; then
  printf -v quoted_remote_dir '%q' "${XSERVER_DEPLOY_REMOTE_DIR%/}"
  ssh "${SSH_ARGS[@]}" "${XSERVER_DEPLOY_USER}@${XSERVER_DEPLOY_HOST}" "mkdir -p $quoted_remote_dir"
fi

rsync "${RSYNC_ARGS[@]}" -e "$SSH_COMMAND" "$SOURCE_PATH/" "$REMOTE"
