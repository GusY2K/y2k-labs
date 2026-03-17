# Workflows, Patterns & Best Practices

## Idempotent Work Item Creation

```bash
# Create only if doesn't exist with same title
create_if_new() {
  local title="$1"
  local type="$2"

  WI_ID=$(az boards query \
    --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType]='$type' AND [System.Title]='$title' AND [System.State] <> 'Removed'" \
    --query "[0].id" -o tsv 2>/dev/null)

  if [ -z "$WI_ID" ]; then
    WI_ID=$(az boards work-item create --type "$type" --title "$title" --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
    echo "CREATED:$WI_ID"
  else
    echo "EXISTS:$WI_ID"
  fi
}
```

## Retry Logic for API Calls

```bash
retry_command() {
  local max_attempts=3
  local attempt=1
  local delay=5

  while [ $attempt -le $max_attempts ]; do
    if "$@" 2>/dev/null; then
      return 0
    fi
    echo "Attempt $attempt failed. Retrying in ${delay}s..."
    sleep $delay
    attempt=$((attempt + 1))
    delay=$((delay * 2))
  done

  echo "All $max_attempts attempts failed"
  return 1
}

# Usage
retry_command az boards work-item create --type "Epic" --title "My Epic" --output json
```

## Rate Limiting Strategy

Azure DevOps throttles at ~200 requests per 5 minutes. For bulk operations:

```bash
# Add delay between creates (50+ items)
DELAY=0.5  # 500ms between calls

for item in "${items[@]}"; do
  az boards work-item create --type "User Story" --title "$item" --output json
  sleep $DELAY
done
```

## Session Tagging Pattern

Tag all items from a session for easy querying and rollback:

```bash
SESSION_TAG="backlog-creator-$(date +%Y%m%d-%H%M%S)"

# Create with session tag
az boards work-item create \
  --type "Epic" \
  --title "My Epic" \
  --fields "System.Tags=$SESSION_TAG" \
  --output json

# Query all items from session
az boards query \
  --wiql "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.Tags] CONTAINS '$SESSION_TAG'" \
  --output table

# Rollback session (delete all items with tag)
for id in $(az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.Tags] CONTAINS '$SESSION_TAG'" --query "[].id" -o tsv); do
  az boards work-item delete --id $id --yes
done
```

## Verify Hierarchy Integrity

```bash
# Check if item has parent
check_parent() {
  local id=$1
  RELATIONS=$(az boards work-item show --id $id --query "relations[?rel=='System.LinkTypes.Hierarchy-Reverse'].url" -o tsv)
  if [ -z "$RELATIONS" ]; then
    echo "ORPHAN: $id has no parent"
  else
    echo "OK: $id has parent"
  fi
}

# Check all tasks for parents
for id in $(az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType]='Task' AND [System.State] <> 'Closed'" --query "[].id" -o tsv); do
  check_parent $id
done
```

## Duplicate Detection

```bash
# Find potential duplicates (same title)
az boards query \
  --wiql "SELECT [System.Id], [System.Title], [System.WorkItemType] FROM WorkItems WHERE [System.State] <> 'Closed' ORDER BY [System.Title]" \
  --output json | python3 -c "
import sys, json
from collections import Counter
items = json.load(sys.stdin)
titles = [i['fields']['System.Title'].lower().strip() for i in items]
dupes = {t: c for t, c in Counter(titles).items() if c > 1}
for title, count in sorted(dupes.items()):
    print(f'  DUPLICATE ({count}x): {title}')
"
```

## Error Handling

```bash
# Check if az boards is available
if ! az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.Id] = 1" &>/dev/null; then
  echo "ERROR: Cannot access Azure DevOps. Check:"
  echo "  1. az login"
  echo "  2. az extension add --name azure-devops"
  echo "  3. az devops configure --defaults organization=... project=..."
  exit 1
fi

# Handle permission errors
OUTPUT=$(az boards work-item create --type "Epic" --title "Test" --output json 2>&1)
if echo "$OUTPUT" | grep -q "unauthorized\|forbidden\|403"; then
  echo "ERROR: Insufficient permissions. Need 'Work Items - Write' permission."
  exit 1
fi
```

## Windows PowerShell Gotchas

```bash
# PowerShell breaks SQL with commas/spaces in --command
# WRONG: gcloud ssh --command='az boards query --wiql "SELECT ..."'
# RIGHT: Write SQL to a file, scp it, then execute

# PowerShell quoting for az boards
# Use single quotes for WIQL, double quotes inside
az boards query --wiql 'SELECT [System.Id] FROM WorkItems WHERE [System.Title] = "My Title"'

# Escape HTML in field values
az boards work-item create --type "User Story" --fields "Microsoft.VSTS.Common.AcceptanceCriteria=<ul><li>Criterion 1</li></ul>"
```

## Process Template Detection

```bash
# Detect which process template the project uses
PROJECT_INFO=$(az devops project show --project {project} --output json)
PROCESS=$(echo "$PROJECT_INFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('capabilities',{}).get('processTemplate',{}).get('templateName','Unknown'))")
echo "Process template: $PROCESS"

# Map work item types by template
case "$PROCESS" in
  "Agile") STORY_TYPE="User Story"; MID_TYPE="Feature" ;;
  "Scrum") STORY_TYPE="Product Backlog Item"; MID_TYPE="Feature" ;;
  "Basic") STORY_TYPE="Issue"; MID_TYPE="Issue" ;;
  *) STORY_TYPE="User Story"; MID_TYPE="Feature" ;;
esac
```
