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

lftp -u "$DEPLOY_USER","$DEPLOY_PASS" -p "$DEPLOY_PORT" "sftp://$DEPLOY_HOST" <<EOF
set sftp:auto-confirm yes
cd "$DEPLOY_PATH"
rm -r bosse-hoppar/.git
mirror -R --delete --verbose \
  --exclude-glob .git \
  --exclude-glob .git/** \
  --exclude-glob .DS_Store \
  ./ bosse-hoppar/
bye
EOF
