# Azure DevOps CLI Reference

## Work Item Types by Process Template

### Agile
- Epic
- Feature
- User Story
- Task
- Bug
- Issue
- Test Plan / Test Suite / Test Case

### Scrum
- Epic
- Feature
- Product Backlog Item
- Task
- Bug
- Impediment
- Test Plan / Test Suite / Test Case

### Basic
- Epic
- Issue
- Task

## Common Fields

| Field Reference | Display Name | Applies To |
|----------------|--------------|------------|
| `System.Title` | Title | All |
| `System.Description` | Description | All |
| `System.State` | State | All |
| `System.AssignedTo` | Assigned To | All |
| `System.Tags` | Tags | All |
| `System.AreaPath` | Area Path | All |
| `System.IterationPath` | Iteration Path | All |
| `Microsoft.VSTS.Common.Priority` | Priority (1-4) | All |
| `Microsoft.VSTS.Common.AcceptanceCriteria` | Acceptance Criteria | User Story, PBI |
| `Microsoft.VSTS.Scheduling.StoryPoints` | Story Points | User Story |
| `Microsoft.VSTS.Scheduling.Effort` | Effort | PBI (Scrum) |
| `Microsoft.VSTS.Scheduling.RemainingWork` | Remaining Work (hours) | Task |
| `Microsoft.VSTS.Scheduling.OriginalEstimate` | Original Estimate (hours) | Task |
| `Microsoft.VSTS.TCM.ReproSteps` | Repro Steps | Bug |
| `Microsoft.VSTS.Common.Severity` | Severity | Bug |
| `Microsoft.VSTS.Common.ValueArea` | Value Area | Feature, Epic |
| `Microsoft.VSTS.Common.BusinessValue` | Business Value | Feature, Epic |
| `Microsoft.VSTS.Common.Risk` | Risk | User Story |
| `Microsoft.VSTS.Common.StackRank` | Stack Rank | All |

## Relation Types

| Relation | Reference Name | Description |
|----------|---------------|-------------|
| Parent | `System.LinkTypes.Hierarchy-Reverse` | Links child to parent |
| Child | `System.LinkTypes.Hierarchy-Forward` | Links parent to child |
| Related | `System.LinkTypes.Related` | General relationship |
| Predecessor | `System.LinkTypes.Dependency-Reverse` | Depends on |
| Successor | `System.LinkTypes.Dependency-Forward` | Is depended on by |

## az boards Commands

### Create Work Item
```bash
az boards work-item create \
  --type "<type>" \
  --title "<title>" \
  --description "<html>" \
  --area "<area-path>" \
  --iteration "<iteration-path>" \
  --assigned-to "<email>" \
  --fields "Field1=Value1" "Field2=Value2" \
  --output json
```

### Add Relation (Parent-Child)
```bash
az boards work-item relation add \
  --id <child-id> \
  --relation-type "parent" \
  --target-id <parent-id>
```

### Query Work Items (WIQL)
```bash
az boards query \
  --wiql "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.Tags] CONTAINS 'my-tag'" \
  --output table
```

### Show Work Item Details
```bash
az boards work-item show --id <id> --output json
```

### Update Work Item
```bash
az boards work-item update \
  --id <id> \
  --fields "System.State=Active" "Microsoft.VSTS.Common.Priority=1"
```

## States by Work Item Type (Agile)

| Type | New | Active | Resolved | Closed | Removed |
|------|-----|--------|----------|--------|---------|
| Epic | New | Active | Resolved | Closed | Removed |
| Feature | New | Active | Resolved | Closed | Removed |
| User Story | New | Active | Resolved | Closed | Removed |
| Task | New | Active | Closed | — | Removed |
| Bug | New | Active | Resolved | Closed | — |

## Story Point Fibonacci Scale

| Points | Meaning | Example |
|--------|---------|---------|
| 1 | Trivial | Config change, text update |
| 2 | Small | Simple CRUD endpoint, UI tweak |
| 3 | Medium | New component with logic, API integration |
| 5 | Large | Complex feature, multi-service change |
| 8 | Very Large | Cross-cutting concern, new subsystem |
| 13 | Epic-sized | Should probably be broken down further |

## Priority Scale

| Priority | Label | When to Use |
|----------|-------|-------------|
| 1 | Critical | Blocking, security, data loss |
| 2 | High | Important for release, core functionality |
| 3 | Medium | Should do, improves quality/UX |
| 4 | Low | Nice to have, polish, minor improvements |
