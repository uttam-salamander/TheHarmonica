#!/bin/bash
# Post-write verification hook for HarpFlow
# Runs after Write/Edit tools to verify code quality

# Change to project root
cd "$(dirname "$0")/../.." || exit 0

# Read the tool input from stdin
INPUT=$(cat)

# Extract file path from the JSON input
FILE_PATH=$(echo "$INPUT" | sed -n 's/.*"file_path":"\([^"]*\)".*/\1/p')

# Only run checks for TypeScript/JavaScript files in src/
if [[ "$FILE_PATH" == *src/*.ts* ]] || [[ "$FILE_PATH" == *src/*.js* ]]; then
  echo ""
  echo "🔍 Running code verification..."

  # Run TypeScript type check
  if ! bun run typecheck 2>&1 | tail -5; then
    echo "❌ TypeScript errors detected"
    exit 1
  fi

  echo "✅ Code verified"
fi

exit 0
