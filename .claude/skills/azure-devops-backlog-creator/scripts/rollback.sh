#!/usr/bin/env bash
# Rolls back work items created by a specific session
# Usage: bash rollback.sh <session-tag> [--org=<org>] [--project=<project>] [--confirm]
#
# Example: bash rollback.sh backlog-creator-20260317-143022 --confirm

set -euo pipefail

SESSION_TAG="${1:-}"
CONFIRM=false
ORG=""
PROJECT=""

if [ -z "${SESSION_TAG}" ]; then
    echo "Usage: bash rollback.sh <session-tag> [--org=<org>] [--project=<project>] [--confirm]"
    echo "Example: bash rollback.sh backlog-creator-20260317-143022 --confirm"
    exit 1
fi

for arg in "$@"; do
    case $arg in
        --confirm) CONFIRM=true ;;
        --org=*) ORG="${arg#*=}" ;;
        --project=*) PROJECT="${arg#*=}" ;;
    esac
done

ORG_FLAG=""
PROJECT_FLAG=""
[ -n "${ORG}" ] && ORG_FLAG="--organization https://dev.azure.com/${ORG}"
[ -n "${PROJECT}" ] && PROJECT_FLAG="--project ${PROJECT}"

echo "=== Rollback: ${SESSION_TAG} ==="
echo ""

# Find all work items with this session tag
WIQL="SELECT [System.Id], [System.WorkItemType], [System.Title] FROM WorkItems WHERE [System.Tags] CONTAINS '${SESSION_TAG}' ORDER BY [System.Id] DESC"

echo "Querying work items with tag '${SESSION_TAG}'..."
ITEMS=$(az boards query --wiql "${WIQL}" ${ORG_FLAG} ${PROJECT_FLAG} --output json 2>/dev/null)

COUNT=$(echo "${ITEMS}" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

if [ "${COUNT}" = "0" ]; then
    echo "No work items found with tag '${SESSION_TAG}'"
    exit 0
fi

echo "Found ${COUNT} work items to delete:"
echo ""
echo "${ITEMS}" | python3 -c "
import sys, json
items = json.load(sys.stdin)
for item in items:
    fields = item.get('fields', {})
    print(f\"  ID: {item['id']} | {fields.get('System.WorkItemType', '?')} | {fields.get('System.Title', '?')}\")
" 2>/dev/null

echo ""

if [ "${CONFIRM}" != "true" ]; then
    echo "WARNING: This will permanently delete ${COUNT} work items."
    echo "Run with --confirm to execute the deletion."
    exit 0
fi

echo "Deleting ${COUNT} work items (children first, parents last)..."
echo "${ITEMS}" | python3 -c "
import sys, json
items = json.load(sys.stdin)
for item in items:
    print(item['id'])
" 2>/dev/null | while read -r ID; do
    echo -n "  Deleting #${ID}... "
    if az boards work-item delete --id "${ID}" --yes ${ORG_FLAG} ${PROJECT_FLAG} &>/dev/null 2>&1; then
        echo "OK"
    else
        echo "FAILED"
    fi
done

echo ""
echo "Rollback complete."
