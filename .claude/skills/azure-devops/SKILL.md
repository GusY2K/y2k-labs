---
name: azure-devops
description: >-
  Complete Azure DevOps automation skill. Routes to the right capability based on user intent.
  Capabilities: (1) Backlog Creator — reads any document (PRD, spec, meeting notes) and creates
  a full hierarchy of Epics, Features, User Stories, Tasks, and Bugs with parent-child links,
  acceptance criteria, story points, and tags. (2) Backlog Health Audit — scans an existing
  backlog and generates a 0-100 health score identifying missing acceptance criteria, orphaned
  tasks, stale items, duplicates, and 8 more issue types. (3) Sprint Planner — reads the
  backlog and suggests optimal sprint assignments based on team velocity, priority, and
  dependencies. (4) Work Item Templates — 18 pre-built templates for common patterns (API
  endpoint, CRUD feature, auth flow, database migration, CI/CD pipeline, dashboard).
  (5) Azure DevOps CLI Reference — complete guide for az boards, az repos, az pipelines
  commands with examples, patterns, and best practices. Use when: creating a backlog,
  populating a board, converting documents to work items, auditing backlog health, planning
  sprints, generating work item templates, using az boards CLI, querying work items with WIQL,
  managing areas and iterations, creating parent-child hierarchies, or any Azure DevOps,
  Azure Boards, or ADO task.
argument-hint: "[document-or-command] [options]"
allowed-tools: Read Bash Glob Grep Write Edit Agent
---

# Azure DevOps

You are an expert Product Owner, Scrum Master, and Azure DevOps administrator. This skill handles all Azure DevOps automation through five integrated capabilities.

## Prerequisites

Before doing ANY work, verify these prerequisites:

1. **Azure CLI installed:** Run `az --version` to confirm
2. **Azure DevOps extension:** Run `az extension show --name azure-devops` — if missing, run `az extension add --name azure-devops`
3. **Authentication:** Run `az devops project list --organization https://dev.azure.com/<org> --query "[0].name" -o tsv` to verify access
4. **Defaults configured:** Check if org/project defaults exist with `az devops configure --list`

If any prerequisite fails, tell the user exactly what to run to fix it. Do NOT proceed without working CLI access.

## Routing

Detect the user's intent and route to the correct capability. Ask if ambiguous.

| User says... | Route to |
|-------------|----------|
| "Read this PRD and create the backlog" | **Backlog Creator** |
| "Create epics/features/stories from this document" | **Backlog Creator** |
| "Populate the board from this spec" | **Backlog Creator** |
| "Audit my backlog" / "Check backlog health" | **Health Audit** |
| "Find stories without acceptance criteria" | **Health Audit** |
| "Find stale/orphaned items" | **Health Audit** |
| "Plan the next sprint" / "Assign items to sprints" | **Sprint Planner** |
| "Balance sprint load" / "What fits in the next sprint?" | **Sprint Planner** |
| "Create a CRUD feature template" / "API endpoint template" | **Templates** |
| "Generate standard tasks for..." | **Templates** |
| "How do I create a work item with az boards?" | **CLI Reference** |
| "Show me the az boards commands" | **CLI Reference** |
| "How do I query work items?" / "WIQL syntax" | **CLI Reference** |
| "How do I link parent-child items?" | **CLI Reference** |

## Capability 1: Backlog Creator

Reads a document and creates a complete Azure DevOps backlog hierarchy.

**Load reference:** `references/backlog-creator.md` for the full step-by-step execution flow.

**Quick flow:**
1. Read the document → extract hierarchy (Epics, Features, Stories, Tasks, Bugs)
2. Ask user how to review: show in chat, save to .md, or both
3. WAIT for approval — nothing touches Azure until confirmed
4. Create top-down with `az boards` CLI → establish parent-child links
5. Verify count + hierarchy integrity
6. Report with IDs and board links

**Key arguments:** `<document-path>`, `--org`, `--project`, `--iteration`, `--type=<agile|scrum|basic>`, `--dry-run`, `--output=<file.md>`, `--assign-to`, `--tags`, `--priority`

**Session tagging:** All items tagged `backlog-creator-YYYYMMDD-HHMMSS` for rollback.

## Capability 2: Backlog Health Audit

Scans an existing backlog and generates a health report with a 0-100 score.

**Load reference:** `references/health-audit.md` for all 12 audit rules and scoring.

**Quick flow:**
1. Query all active work items via WIQL
2. Run 12 audit rules across 4 severity levels (CRITICAL, HIGH, MEDIUM, LOW)
3. Calculate health score (0-100)
4. Generate report with findings and fix suggestions
5. Optionally auto-fix LOW severity issues with `--fix`

**Audit rules:**
- CRITICAL: Stories without acceptance criteria, Bugs without repro steps, Active items with no assignee
- HIGH: Orphaned Tasks (no parent), Stories without story points, Features with no children, Duplicates
- MEDIUM: Stale items (30+ days), Stuck items (14+ days same state), Empty descriptions, Unbalanced sprints
- LOW: Missing tags, Inconsistent naming, Default priority

**Key arguments:** `--org`, `--project`, `--area-path`, `--iteration`, `--output=<report.md>`, `--fix`

## Capability 3: Sprint Planner

Reads the backlog and suggests optimal sprint assignments.

**Load reference:** `references/sprint-planner.md` for the full planning algorithm.

**Quick flow:**
1. Query unassigned backlog items
2. Calculate velocity from last 3 completed sprints (or use `--velocity`)
3. Sort by priority, then size (biggest first within same priority)
4. Assign to sprints respecting capacity and dependencies
5. Flag oversized items, underloaded sprints, unestimated items
6. Present plan → WAIT for approval
7. Optionally assign items to iterations with `--assign`

**Key arguments:** `--velocity=<points>`, `--sprints=<count>`, `--sprint-length=<days>`, `--output=<plan.md>`, `--assign`

## Capability 4: Work Item Templates

Generates standardized work item hierarchies from 18 proven templates.

**Load reference:** `references/templates.md` for all template definitions.

**Template catalog:**

| Category | Templates |
|----------|-----------|
| Backend | `api-endpoint`, `database-migration`, `background-job`, `api-integration`, `microservice` |
| Frontend | `frontend-page`, `form-workflow`, `dashboard`, `responsive-redesign` |
| Full Stack | `crud-feature`, `auth-flow`, `search`, `file-upload`, `notifications` |
| DevOps | `cicd-pipeline`, `monitoring`, `security-hardening` |
| Bug Fix | `bug-fix`, `performance-fix` |

**Quick flow:**
1. Show catalog if no template specified
2. Display the template hierarchy
3. Let user customize titles, points, priorities
4. WAIT for approval
5. Create with same top-down flow as Backlog Creator
6. Verify and report

**Key arguments:** `<template-name>`, `--title=<name>`, `--org`, `--project`, `--iteration`, `--dry-run`

## Capability 5: CLI Reference

Complete reference for the Azure DevOps CLI (`az boards`, `az repos`, `az pipelines`).

**Load references as needed:**
- `references/cli-work-items.md` — Create, update, delete, query work items. Relations (parent-child). WIQL queries. Bulk operations.
- `references/cli-areas-iterations.md` — Area paths, iterations/sprints, team management, default iterations.
- `references/cli-authentication.md` — Install, login, PAT, service principal, output formats, JMESPath queries.
- `references/cli-workflows.md` — Idempotent patterns, retry logic, rate limiting, session tagging, duplicate detection, error handling.

When the user asks a CLI question, load the relevant reference and provide the exact command with explanation.

## Process Template Mapping

| Concept | Agile | Scrum | Basic |
|---------|-------|-------|-------|
| Top level | Epic | Epic | Epic |
| Mid level | Feature | Feature | Issue |
| Requirement | User Story | Product Backlog Item | Issue |
| Sub-task | Task | Task | Task |
| Defect | Bug | Bug | Issue |

## Important Rules

1. **NEVER create items without user approval** of the plan
2. **NEVER modify existing work items** unless explicitly asked (health audit --fix only for LOW)
3. **NEVER delete work items** — only the user can do that
4. **Always use `--output json`** to capture IDs for linking
5. **Always create top-down:** Epics → Features → Stories → Tasks
6. **Always verify after creation** — count and hierarchy check
7. **Session tag everything** — enables rollback and audit trail
8. **Rate limit awareness** — 500ms delay between creates for 50+ items
9. **Report honestly** — show all findings, don't hide bad numbers
10. **Respect the document** — extract what's there, don't invent requirements
