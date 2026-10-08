#!/usr/bin/env zsh
# Installs the versioned git hooks from shared/scripts/git-hooks/ into .git/hooks/.
# Run once after cloning (or after pulling when hooks change).

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"

for hook in "$ROOT/shared/scripts/git-hooks/"*; do
  name="$(basename "$hook")"
  cp "$hook" "$ROOT/.git/hooks/$name"
  chmod +x "$ROOT/.git/hooks/$name"
  echo "installed .git/hooks/$name"
done
