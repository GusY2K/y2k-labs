# Work Items, Relations & Hierarchy

## Create Work Items

```bash
# Basic work item
az boards work-item create \
  --title "Fix login bug" \
  --type Bug \
  --assigned-to user@example.com \
  --description "Users cannot login with SSO"

# With area, iteration, and custom fields
az boards work-item create \
  --title "New feature" \
  --type "User Story" \
  --area "Project\\Team\\Area" \
  --iteration "Project\\Sprint 1" \
  --fields "Microsoft.VSTS.Common.Priority=1" "Microsoft.VSTS.Scheduling.StoryPoints=5" \
  --output json

# With acceptance criteria (HTML)
az boards work-item create \
  --title "User can reset password" \
  --type "User Story" \
  --fields "Microsoft.VSTS.Common.AcceptanceCriteria=<ul><li>Reset link expires after 1 hour</li><li>New password meets strength requirements</li></ul>" \
  --output json

# Bug with repro steps
az boards work-item create \
  --title "Login 500 error" \
  --type Bug \
  --fields "Microsoft.VSTS.TCM.ReproSteps=<ol><li>Go to /login</li><li>Enter valid email</li><li>Click Sign In</li></ol>" "Microsoft.VSTS.Common.Severity=1 - Critical" \
  --output json

# Task with remaining work estimate
az boards work-item create \
  --title "Implement auth endpoint" \
  --type Task \
  --fields "Microsoft.VSTS.Scheduling.RemainingWork=4" "Microsoft.VSTS.Scheduling.OriginalEstimate=4" \
  --output json

# Open in browser after creation
az boards work-item create --title "Bug" --type Bug --open
```

## Update Work Items

```bash
# Update state, title, and assignee
az boards work-item update \
  --id {id} \
  --state "Active" \
  --title "Updated title" \
  --assigned-to user@example.com

# Move to different area/iteration
az boards work-item update \
  --id {id} \
  --area "Project\\Team\\NewArea" \
  --iteration "Project\\Sprint 5"

# Add discussion comment
az boards work-item update \
  --id {id} \
  --discussion "Work in progress — blocked by API dependency"

# Update custom fields
az boards work-item update \
  --id {id} \
  --fields "Microsoft.VSTS.Common.Priority=1" "Microsoft.VSTS.Scheduling.StoryPoints=8"
```

## Delete Work Items

```bash
# Soft delete (can be restored from recycle bin)
az boards work-item delete --id {id} --yes

# Permanent delete (IRREVERSIBLE)
az boards work-item delete --id {id} --destroy --yes
```

## Show Work Item Details

```bash
az boards work-item show --id {id}
az boards work-item show --id {id} --output json
az boards work-item show --id {id} --open  # Open in browser
```

## Relations (Parent-Child Links)

```bash
# Add parent link (child → parent)
az boards work-item relation add \
  --id {child-id} \
  --relation-type "parent" \
  --target-id {parent-id}

# Add child link (parent → child)
az boards work-item relation add \
  --id {parent-id} \
  --relation-type "child" \
  --target-id {child-id}

# Add related link
az boards work-item relation add \
  --id {id} \
  --relation-type "related" \
  --target-id {related-id}

# Add predecessor (dependency)
az boards work-item relation add \
  --id {id} \
  --relation-type "predecessor" \
  --target-id {depends-on-id}

# List relations
az boards work-item relation list --id {id}

# List all relation types
az boards work-item relation list-type

# Remove relation
az boards work-item relation remove --id {id} --relation-id {relation-id} --yes
```

## Hierarchy Creation Pattern (Top-Down)

```bash
# 1. Create Epic
EPIC_ID=$(az boards work-item create \
  --type "Epic" \
  --title "User Authentication" \
  --fields "Microsoft.VSTS.Common.Priority=1" \
  --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# 2. Create Feature linked to Epic
FEATURE_ID=$(az boards work-item create \
  --type "Feature" \
  --title "User Registration" \
  --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
az boards work-item relation add --id $FEATURE_ID --relation-type "parent" --target-id $EPIC_ID

# 3. Create User Story linked to Feature
STORY_ID=$(az boards work-item create \
  --type "User Story" \
  --title "Register with email and password" \
  --fields "Microsoft.VSTS.Scheduling.StoryPoints=5" "Microsoft.VSTS.Common.Priority=1" \
  --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
az boards work-item relation add --id $STORY_ID --relation-type "parent" --target-id $FEATURE_ID

# 4. Create Task linked to User Story
TASK_ID=$(az boards work-item create \
  --type "Task" \
  --title "Create registration API endpoint" \
  --fields "Microsoft.VSTS.Scheduling.RemainingWork=4" \
  --output json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
az boards work-item relation add --id $TASK_ID --relation-type "parent" --target-id $STORY_ID
```

## WIQL Queries

```bash
# All active items assigned to me
az boards query --wiql "SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.AssignedTo] = @Me AND [System.State] = 'Active'" --output table

# Items by tag
az boards query --wiql "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.Tags] CONTAINS 'backlog-creator'" --output json

# User Stories without acceptance criteria
az boards query --wiql "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.WorkItemType] = 'User Story' AND [System.State] <> 'Closed' AND [Microsoft.VSTS.Common.AcceptanceCriteria] = ''" --output table

# Items not updated in 30 days
az boards query --wiql "SELECT [System.Id], [System.Title], [System.ChangedDate] FROM WorkItems WHERE [System.State] <> 'Closed' AND [System.ChangedDate] < @Today - 30" --output table

# Count by type
az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.Tags] CONTAINS 'session-tag'" --output json | python3 -c "import sys,json; print(len(json.load(sys.stdin)))"

# Items in current sprint
az boards query --wiql "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.IterationPath] = @CurrentIteration" --output table
```

## Bulk Operations

```bash
# Bulk update state
for id in $(az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.State]='New' AND [System.Tags] CONTAINS 'my-tag'" --query "[].id" -o tsv); do
  az boards work-item update --id $id --state "Active"
done

# Bulk delete by tag (use with caution)
for id in $(az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.Tags] CONTAINS 'delete-me'" --query "[].id" -o tsv); do
  az boards work-item delete --id $id --yes
done

# Bulk add tag
for id in $(az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType]='User Story' AND [System.State]='New'" --query "[].id" -o tsv); do
  az boards work-item update --id $id --fields "System.Tags=needs-review"
done
```
