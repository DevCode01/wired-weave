#!/usr/bin/env bash
# Auto-generated test harness — run after cloning to verify the build.
set -uo pipefail
FAIL=0

echo "-- syntax/build check --"
if node --check wired-weave.js; then echo "  ok"; else echo "  FAIL"; FAIL=1; fi

echo "-- functional check --"
OUT="$(rm -f /tmp/wired-weave-fc.json && KANBAN_DB=/tmp/wired-weave-fc.json ./wired-weave.js add todo Task1 && KANBAN_DB=/tmp/wired-weave-fc.json ./wired-weave.js board 2>&1)"
if echo "$OUT" | grep -qF -- 'Task1'; then
  echo "  ok   - contains: Task1"
else
  echo "  FAIL - expected to contain: Task1"
  echo "  got: $OUT"
  FAIL=1
fi

if [ "$FAIL" = "1" ]; then echo; echo "FAILED"; exit 1; fi
echo; echo "All tests passed."
