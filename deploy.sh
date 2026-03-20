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
cd "$DEPLOY_PATH"
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
cd "$DEPLOY_PATH/bosse-hoppar"
put "$file"
bye
EOF
  fi
done

for dir in "${local_dirs[@]}"; do
  if [[ -d "$dir" ]]; then
    lftp -u "$DEPLOY_USER","$DEPLOY_PASS" -p "$DEPLOY_PORT" "sftp://$DEPLOY_HOST" <<EOF
set sftp:auto-confirm yes
cd "$DEPLOY_PATH/bosse-hoppar"
mirror -R --delete --verbose \
  --exclude-glob .DS_Store \
  "$dir" "$dir"
bye
EOF
  fi
done
