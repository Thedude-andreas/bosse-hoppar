#!/bin/zsh

set -euo pipefail

ENV_FILE="/Users/andreasmartensson/Library/CloudStorage/SynologyDrive-Synk/Projekt/Vibe/AMC/.env"

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

local_files=(
  "index.html"
  "style.css"
  "script.js"
  "supabase-config.js"
)

local_dirs=(
  "assets"
)

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
