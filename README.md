# po-skills

<p align="center">
  <img src="assets/banner-preview.png" alt="po-skills banner" width="620">
</p>

<p align="center">
  Product Owner agent skills for Azure DevOps. Reads documents and creates full backlogs automatically.
</p>

<p align="center">
  Built on the <a href="https://agentskills.io/specification">Agent Skills</a> open standard. Works with <strong>Claude Code, Cursor, GitHub Copilot, Windsurf, Cline</strong>, and <a href="https://github.com/vercel-labs/skills">40+ AI agents</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/po-skills"><img src="https://img.shields.io/npm/v/po-skills?color=00F0A0&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/po-skills"><img src="https://img.shields.io/npm/dm/po-skills?color=00F0A0&label=downloads" alt="npm downloads"></a>
  <a href="https://github.com/GusY2K/po-skills/stargazers"><img src="https://img.shields.io/github/stars/GusY2K/po-skills?color=00F0A0&style=flat" alt="GitHub stars"></a>
  <a href="https://github.com/GusY2K/po-skills"><img src="https://img.shields.io/github/license/GusY2K/po-skills?color=00F0A0" alt="license"></a>
</p>

---

## Install

```bash
npx po-skills -g
```

> **Project-only** (not global):
> ```bash
> npx po-skills
> ```

### Other install methods

<details>
<summary>Windows (copy mode)</summary>

```bash
npx po-skills -g --copy
```
</details>

<details>
<summary>Specific runtime only</summary>

```bash
npx po-skills -g --agent=cursor
npx po-skills -g --agent=copilot
npx po-skills -g --agent=windsurf
npx po-skills -g --agent=cline
npx po-skills -g --agent=all
```
</details>

<details>
<summary>Manual install (git clone)</summary>

```bash
git clone https://github.com/GusY2K/po-skills.git
cd po-skills
node bin/install.js -g
```
</details>

### Verify

Start a new Claude Code session and type `/` — you should see `azure-devops-backlog-creator` in the list.

---

## Update

```bash
# Update to latest version (re-runs the installer with newest skills)
npx po-skills@latest -g
```

## Manage

### Uninstall

Delete the skill folders from `~/.claude/skills/` (or the equivalent for your runtime).

---

## Skills (4)

| Skill | Description |
|-------|-------------|
| [azure-devops-backlog-creator](#azure-devops-backlog-creator) | Document → full backlog with hierarchy |
| [backlog-health-audit](#backlog-health-audit) | Scan backlog for quality issues and generate health report |
| [sprint-planner](#sprint-planner) | Auto-assign items to sprints based on velocity |
| [work-item-templates](#work-item-templates) | Generate standard work items from 18 proven templates |

---

### azure-devops-backlog-creator

Reads any document (PRD, spec, markdown, feature brief, meeting notes) and creates a complete Azure DevOps backlog: **Epics → Features → User Stories → Tasks → Bugs**, with parent-child links, acceptance criteria, story points, and tags.

#### Invocation

**Option A — Slash command:**
```
/azure-devops-backlog-creator path/to/document.md
```

**Option B — Natural language (auto-detected):**
> "Read this PRD and create the epics and user stories in Azure DevOps"
>
> "Generate the backlog from this spec"
>
> "Create work items from this requirements doc"

Claude detects intent automatically — no slash command needed.

#### Arguments

```
/azure-devops-backlog-creator <document> [options]
```

| Argument | Description | Default |
|----------|-------------|---------|
| `<document>` | Path to the requirements document | **Required** |
| `--org=<name>` | Azure DevOps organization | `az devops` default |
| `--project=<name>` | Azure DevOps project | `az devops` default |
| `--type=<template>` | Process template: `agile`, `scrum`, `basic` | `agile` |
| `--iteration=<path>` | Sprint/iteration path | Current iteration |
| `--area-path=<path>` | Area path | Project root |
| `--assign-to=<email>` | Default assignee | Unassigned |
| `--tags=<t1,t2>` | Extra tags on all items | None |
| `--priority=<1-4>` | Default priority | `2` |
| `--output=<file>` | Save plan to .md file for review | None (shows in chat) |
| `--dry-run` | Preview plan without creating | `false` |

#### Examples

```bash
# Basic — read a PRD, create everything
/azure-devops-backlog-creator docs/auth-prd.md

# Scrum template, specific sprint
/azure-devops-backlog-creator spec.md --type=scrum --iteration="Sprint 5"

# Dry run — see what would be created
/azure-devops-backlog-creator requirements.md --dry-run

# Save plan to file for review before creating
/azure-devops-backlog-creator spec.md --output=backlog-plan.md

# Full options
/azure-devops-backlog-creator feature.md --org=myorg --project=MyApp --assign-to=dev@company.com --tags=mvp,backend --priority=2
```

#### How it works

```
1. READ        Parse document → extract hierarchy (Epics, Features, Stories, Tasks, Bugs)
2. PLAN        Ask: show in chat, save to .md file, or both?
3. REVIEW      You review the plan (edit the .md file if needed)
4. CONFIRM     Nothing touches Azure until you say yes
5. CREATE      Top-down creation with az boards CLI → parent-child links established
6. VERIFY      Count check + hierarchy validation → all items linked correctly
7. REPORT      Summary table with IDs + direct links to your Azure board
```

Every session tags all items with `backlog-creator-YYYYMMDD-HHMMSS` for easy querying and rollback.

#### Process templates

| Template | Flag | Epic | Mid-level | Requirement | Task | Bug |
|----------|------|------|-----------|-------------|------|-----|
| Agile | `--type=agile` | Epic | Feature | User Story | Task | Bug |
| Scrum | `--type=scrum` | Epic | Feature | Product Backlog Item | Task | Bug |
| Basic | `--type=basic` | Epic | Issue | Issue | Task | Issue |

#### Rollback

```bash
# Preview what would be deleted
bash scripts/rollback.sh backlog-creator-20260317-143022

# Delete all items from that session
bash scripts/rollback.sh backlog-creator-20260317-143022 --confirm
```

#### Supported documents

- `.md` — PRDs, specs, feature briefs, design docs
- `.txt` — Meeting notes, requirements lists
- Any text file Claude Code can read

---

### backlog-health-audit

Scans your existing Azure DevOps backlog and generates a health report with a **0-100 score**.

**Detects:**
- User Stories without acceptance criteria (CRITICAL)
- Bugs without repro steps (CRITICAL)
- Active items with no assignee (CRITICAL)
- Orphaned Tasks with no parent (HIGH)
- Stories without story points (HIGH)
- Stale items not updated in 30+ days (MEDIUM)
- Empty descriptions (MEDIUM)
- Unbalanced sprint loads (MEDIUM)
- Items without tags (LOW)

```bash
# Audit the full backlog
/backlog-health-audit

# Audit specific sprint, save report
/backlog-health-audit --iteration="Sprint 5" --output=health-report.md

# Auto-fix LOW severity issues
/backlog-health-audit --fix
```

Or just say: *"audit my backlog"* / *"check my board health"*

---

### sprint-planner

Reads your backlog and suggests optimal sprint assignments based on **velocity, priority, and dependencies**.

**Features:**
- Auto-calculates velocity from last 3 sprints
- Priority-first ordering (P1 before P2)
- Dependency-aware (predecessors before successors)
- Flags oversized items that need splitting
- Load balancing across sprints (targets 80-90% capacity)
- Can create iterations and move items after approval

```bash
# Plan next 3 sprints automatically
/sprint-planner

# Custom velocity, 5 sprints
/sprint-planner --velocity=40 --sprints=5

# Save plan and assign items after review
/sprint-planner --output=sprint-plan.md --assign
```

Or just say: *"plan the next sprint"* / *"distribute the backlog across sprints"*

---

### work-item-templates

Generate standardized work items from **18 proven templates** for common development patterns.

**Templates:**

| Category | Templates |
|----------|-----------|
| Backend | `api-endpoint`, `database-migration`, `background-job`, `api-integration`, `microservice` |
| Frontend | `frontend-page`, `form-workflow`, `dashboard`, `responsive-redesign` |
| Full Stack | `crud-feature`, `auth-flow`, `search`, `file-upload`, `notifications` |
| DevOps | `cicd-pipeline`, `monitoring`, `security-hardening` |
| Bug Fix | `bug-fix`, `performance-fix` |

```bash
# Generate a full CRUD feature backlog
/work-item-templates crud-feature --title="Product Catalog"

# API endpoint template, dry run
/work-item-templates api-endpoint --title="User Profile API" --dry-run

# Show all available templates
/work-item-templates
```

Or just say: *"create a CRUD feature template for Orders"* / *"generate API endpoint tasks"*

---

## Prerequisites

| # | Requirement | Install |
|---|-------------|---------|
| 1 | Azure CLI | [Install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) |
| 2 | DevOps extension | `az extension add --name azure-devops` |
| 3 | Authentication | `az login` or set `AZURE_DEVOPS_EXT_PAT` env var |
| 4 | Defaults | `az devops configure --defaults organization=https://dev.azure.com/ORG project=PROJECT` |

Quick check:
```bash
bash scripts/validate-prerequisites.sh myorg myproject
```

---

## Team setup

### One-liner for everyone

```bash
npx po-skills -g
```

### Lock to project

```bash
npx po-skills
git add .claude/skills/
git commit -m "chore: add PO skills for Azure DevOps"
```

New contributors clone and run `npx po-skills` to install.

---

## Multi-Runtime Support

po-skills works natively with all major AI coding agents. The installer creates the correct config files for each runtime automatically:

| Runtime | Config Location | Format |
|---------|----------------|--------|
| **Claude Code** | `~/.claude/skills/<name>/` | `SKILL.md` (native) |
| **Cursor** | `.cursor/rules/po-skills.mdc` | MDC rules file |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Project instructions |
| **Windsurf** | `.windsurf/rules/po-skills.md` | Rules file |
| **Cline** | `~/.cline/skills/<name>/` | `SKILL.md` (symlink) |

Install for a specific runtime:
```bash
npx po-skills --agent=cursor
npx po-skills --agent=copilot
npx po-skills --agent=windsurf
npx po-skills --agent=cline
npx po-skills --agent=all        # all runtimes at once
```

Also compatible with any agent that supports the [Agent Skills standard](https://agentskills.io/specification): CodeBuddy, Aider, Continue, OpenCode, Zed, and [30+ more](https://github.com/vercel-labs/skills#supported-agents).

---

## Contributing

1. Fork this repo
2. Add or modify skills in `skills/`
3. Each skill needs a `SKILL.md` with YAML frontmatter (`name` + `description`)
4. Update `.claude-plugin/marketplace.json` if adding new skills
5. Submit a PR

### Create a new skill

```bash
mkdir skills/my-new-skill && touch skills/my-new-skill/SKILL.md
```

---

## License

Apache-2.0 — see [LICENSE.txt](./LICENSE.txt)
