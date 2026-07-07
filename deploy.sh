#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="${0:A:h}"
ENV_FILE="${DEPLOY_ENV_FILE:-$SCRIPT_DIR/.env.deploy}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing deploy env file: $ENV_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

remote_root="${DEPLOY_PATH:-}"

if [[ -z "$remote_root" || "$remote_root" == "." ]]; then
  remote_root="webroots/www"
fi

if [[ "$remote_root" == "/" || "$remote_root" == "~" || "$remote_root" == "/home" || "$remote_root" == "/root" ]]; then
  echo "Refusing to deploy to unsafe DEPLOY_PATH: $remote_root" >&2
  exit 1
fi

local_files=(
  "index.html"
  "style.css"
  "script.js"
  "supabase-config.js"
)

local_dirs=(
  "assets"
)

resolved_path="$(
  lftp -u "$DEPLOY_USER","$DEPLOY_PASS" -p "$DEPLOY_PORT" "sftp://$DEPLOY_HOST" <<EOF
set cmd:fail-exit yes
set sftp:auto-confirm yes
cd "$remote_root"
pwd
bye
EOF
)"

remote_path="$(printf '%s\n' "$resolved_path" | tail -n 1)"

if [[ "$remote_path" == sftp://* ]]; then
  remote_path="/${remote_path#*://*/}"
fi

case "$remote_path" in
  */webroots/www|*/webroots/www/*)
    ;;
  *)
    echo "Resolved remote path '$remote_path' does not look like the main webroot." >&2
    exit 1
    ;;
esac

if [[ "${1:-}" == "--check" ]]; then
  echo "Deploy target OK: $remote_path/bosse-hoppar"
  exit 0
fi

lftp -u "$DEPLOY_USER","$DEPLOY_PASS" -p "$DEPLOY_PORT" "sftp://$DEPLOY_HOST" <<EOF
set sftp:auto-confirm yes
cd "$remote_root"
mkdir -p bosse-hoppar
cd bosse-hoppar
rm -f index.html style.css script.js supabase-config.js
rm -rf assets
bye
EOF

for file in "${local_files[@]}"; do
  if [[ -f "$file" ]]; then
    lftp -u "$DEPLOY_USER","$DEPLOY_PASS" -p "$DEPLOY_PORT" "sftp://$DEPLOY_HOST" <<EOF
set sftp:auto-confirm yes
cd "$remote_root/bosse-hoppar"
put "$file"
bye
EOF
  fi
done

for dir in "${local_dirs[@]}"; do
  if [[ -d "$dir" ]]; then
    lftp -u "$DEPLOY_USER","$DEPLOY_PASS" -p "$DEPLOY_PORT" "sftp://$DEPLOY_HOST" <<EOF
set sftp:auto-confirm yes
cd "$remote_root/bosse-hoppar"
mirror -R --delete --verbose \
  --exclude-glob .DS_Store \
  "$dir" "$dir"
bye
EOF
  fi
done
