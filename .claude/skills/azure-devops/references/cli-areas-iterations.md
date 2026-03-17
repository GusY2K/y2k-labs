# Area Paths & Iterations (Sprints)

## Area Paths

### List Areas

```bash
az boards area project list --project {project}
az boards area project show --path "Project\\Area1" --project {project}
```

### Create Area

```bash
az boards area project create --path "Project\\NewArea" --project {project}
```

### Update Area

```bash
az boards area project update \
  --path "Project\\OldArea" \
  --new-path "Project\\RenamedArea" \
  --project {project}
```

### Delete Area

```bash
az boards area project delete --path "Project\\AreaToDelete" --project {project} --yes
```

### Team Areas

```bash
# List areas for team
az boards area team list --team {team} --project {project}

# Add area to team
az boards area team add --team {team} --path "Project\\NewArea" --project {project}

# Include sub-areas
az boards area team update --team {team} --path "Project\\Area" --project {project} --include-sub-areas true

# Remove area from team
az boards area team remove --team {team} --path "Project\\Area" --project {project}
```

## Iterations (Sprints)

### List Iterations

```bash
az boards iteration project list --project {project}
az boards iteration project show --path "Project\\Sprint 1" --project {project}
```

### Create Iteration

```bash
az boards iteration project create --path "Project\\Sprint 6" --project {project}
```

### Update Iteration

```bash
az boards iteration project update \
  --path "Project\\Sprint 6" \
  --new-path "Project\\Sprint 6 - Extended" \
  --project {project}
```

### Delete Iteration

```bash
az boards iteration project delete --path "Project\\OldSprint" --project {project} --yes
```

### Team Iterations

```bash
# List team iterations
az boards iteration team list --team {team} --project {project}

# Add iteration to team
az boards iteration team add --team {team} --path "Project\\Sprint 6" --project {project}

# Remove iteration from team
az boards iteration team remove --team {team} --path "Project\\Sprint 1" --project {project}

# List work items in iteration
az boards iteration team list-work-items --team {team} --path "Project\\Sprint 5" --project {project}
```

### Default & Backlog Iterations

```bash
# Show current iteration
az boards iteration team show --team {team} --project {project} --timeframe current

# Set default iteration (new items land here)
az boards iteration team set-default-iteration --team {team} --path "Project\\Sprint 6" --project {project}

# Show default iteration
az boards iteration team show-default-iteration --team {team} --project {project}

# Set backlog iteration (catch-all for unplanned items)
az boards iteration team set-backlog-iteration --team {team} --path "Project" --project {project}

# Show backlog iteration
az boards iteration team show-backlog-iteration --team {team} --project {project}
```
