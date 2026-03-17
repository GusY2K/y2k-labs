---
title: I built an AI skill that turns any document into a full Azure DevOps backlog in seconds
published: false
description: po-skills reads your PRD and creates Epics, Features, User Stories, Tasks, and Bugs with parent-child links, acceptance criteria, and story points — all from a single command.
tags: azure, devops, ai, productivity
cover_image:
---

Last week I spent three hours manually creating 47 work items from a product requirements doc. Copying titles. Writing acceptance criteria. Setting story points. Linking parents to children. Tagging everything consistently.

I'll never do that again.

## The problem nobody talks about

Azure DevOps is a solid platform. But the backlog creation experience is stuck in 2015.

You get a PRD. Maybe it's a Google Doc. Maybe a markdown spec. Maybe meeting notes someone threw into Confluence. The requirements are *right there* — Epics, Features, Stories — but to get them into your board, you have to:

1. Read the document and mentally decompose it into work items
2. Click "New Work Item" dozens of times
3. Type each title, description, and acceptance criteria by hand
4. Set story points, priority, tags — one field at a time
5. Create parent-child relationships manually (Feature → Story → Task)
6. Hope you didn't miss anything or create duplicates

For a medium-sized PRD with 5 Epics, that's easily 50-80 work items. Two to four hours of mind-numbing copy-paste. And if the spec changes? Start over.

Product Owners deserve better tooling than this.

## What if your AI agent could just... do it?

I built **po-skills** — a set of four agent skills that automate the entire Product Owner workflow in Azure DevOps.

The flagship skill is the **backlog creator**. You point it at a document, it reads the whole thing, extracts the hierarchy, shows you a plan for approval, and creates every work item with proper links. The whole flow takes about 30 seconds for a 50-item backlog.

Here's what it looks like:

```
/azure-devops-backlog-creator docs/auth-prd.md
```

That's it. One command. The skill reads your document, identifies the structure, and proposes a plan:

```
Backlog Creation Plan

Document: auth-prd.md
Process Template: agile
Session tag: backlog-creator-20260317-143022

Summary
| Type         | Count |
|--------------|-------|
| Epics        | 1     |
| Features     | 4     |
| User Stories | 5     |
| Tasks        | 19    |
| Bugs         | 1     |
| Total        | 30    |

Hierarchy

Epic 1: User Authentication & Authorization
  Feature 1.1: User Registration
    User Story 1.1.1: Register with email and password [SP: 5]
      Task 1.1.1.1: Create registration API endpoint
      Task 1.1.1.2: Build registration form component
      Task 1.1.1.3: Implement email validation service
      Task 1.1.1.4: Add password strength indicator
      Task 1.1.1.5: Write unit tests for registration flow
    User Story 1.1.2: Verify email for account activation [SP: 3]
      Task 1.1.2.1: Create email verification endpoint
      ...
```

You review the plan. Edit it if you want (it can export to a `.md` file you modify directly). When you say "go," it creates everything top-down — Epics first, then Features linked to Epics, then Stories linked to Features, then Tasks linked to Stories.

Every item gets:
- A clear title and HTML description
- Acceptance criteria (Given/When/Then format)
- Story points (Fibonacci scale)
- Priority (1-4)
- Tags including a session tag for easy rollback
- Parent-child relationship to the correct parent

After creation, it verifies the count matches the plan and every link is correct. You get a summary table with IDs and direct links to your board.

## The 7-step flow

Nothing touches Azure DevOps without your explicit approval:

```
1. READ      Parse the document, extract the hierarchy
2. PLAN      Show you what will be created (chat, file, or both)
3. REVIEW    You inspect and edit the plan
4. CONFIRM   You say "yes" — nothing happens until this step
5. CREATE    Top-down creation via az boards CLI
6. VERIFY    Count check + hierarchy validation
7. REPORT    Summary with IDs, links, and session tag
```

The session tag (`backlog-creator-20260317-143022`) means you can always query or roll back everything from a specific run. Made a mistake? One rollback script cleans it all up.

## It's not just one skill — it's four

The backlog creator is the headliner, but I built three more skills that cover the full PO lifecycle:

### 1. azure-devops-backlog-creator

Document to backlog. Supports PRDs, specs, feature briefs, meeting notes — any text document. Works with Agile, Scrum, and Basic process templates.

```
/azure-devops-backlog-creator spec.md --type=scrum --iteration="Sprint 5"

# Dry run — preview without creating
/azure-devops-backlog-creator requirements.md --dry-run
```

### 2. backlog-health-audit

Scans your existing backlog and gives it a health score from 0 to 100. Finds the stuff that slips through grooming: Stories without acceptance criteria. Orphaned Tasks with no parent. Bugs without repro steps. Stale items nobody's touched in 30 days.

```
/backlog-health-audit

# Auto-fix LOW severity issues
/backlog-health-audit --fix
```

It categorizes every issue by severity (CRITICAL, HIGH, MEDIUM, LOW) with specific fix instructions. Run it before sprint planning and your grooming sessions get 10x more productive.

### 3. sprint-planner

Reads your backlog and distributes items across sprints based on actual velocity. It pulls your last 3 sprints to calculate capacity, orders by priority, respects dependencies (predecessors before successors), and flags oversized items that need splitting.

```
/sprint-planner --velocity=40 --sprints=5

# Or just let it auto-calculate from history
/sprint-planner
```

It targets 80-90% sprint capacity — because 100% capacity plans always fail.

### 4. work-item-templates

18 battle-tested templates for common development patterns. Need to scaffold a CRUD feature? An API endpoint? A CI/CD pipeline? A security hardening initiative?

```
/work-item-templates crud-feature --title="Product Catalog"
/work-item-templates auth-flow --title="SSO Integration"
/work-item-templates cicd-pipeline --title="GitHub Actions"
```

Each template generates a Feature with properly structured Stories, Tasks, and acceptance criteria. No more starting from a blank board.

**Full template catalog:** `api-endpoint`, `database-migration`, `background-job`, `api-integration`, `microservice`, `frontend-page`, `form-workflow`, `dashboard`, `responsive-redesign`, `crud-feature`, `auth-flow`, `search`, `file-upload`, `notifications`, `cicd-pipeline`, `monitoring`, `security-hardening`, `bug-fix`.

## How to install

One command:

```bash
npx po-skills -g
```

That installs all four skills globally. Start a new Claude Code session, type `/`, and you'll see them in the skill list.

**Prerequisites:** You need the Azure CLI with the DevOps extension and a configured org/project:

```bash
az extension add --name azure-devops
az login
az devops configure --defaults organization=https://dev.azure.com/YOUR_ORG project=YOUR_PROJECT
```

### Works with more than Claude Code

po-skills is built on the [Agent Skills open standard](https://agentskills.io) (the same spec that powers Vercel's skills ecosystem). That means it works with **Claude Code, Cursor, GitHub Copilot, Windsurf, Cline**, and [40+ other AI agents](https://github.com/vercel-labs/skills#supported-agents) that support the standard.

If your editor can load agent skills, po-skills works.

## What I learned building this

A few things surprised me during development:

**The plan-review-confirm loop matters more than I expected.** Early versions just created items immediately. Users hated it. Nobody wants an AI creating 50 work items they can't preview first. The `.md` export-and-edit flow was the single most impactful feature I added.

**Session tagging is essential for trust.** Every item gets tagged with a session ID. Users who know they can roll back everything from a run are much more willing to try the tool on real projects.

**Process template differences are a pain.** Agile uses "User Story." Scrum uses "Product Backlog Item." Basic uses "Issue" for three different hierarchy levels. Getting the type mapping right across all three templates was more work than the actual creation logic.

## What's next

The roadmap includes:

- **Jira support** — Same skills, different backend. The Agent Skills standard makes this feasible without rewriting everything.
- **GitHub Projects support** — For teams not on Azure DevOps.
- **Dependency graph visualization** — Show the critical path before sprint planning.
- **Bulk update skill** — "Move all P1 items to Sprint 3" via natural language.
- **Team capacity profiles** — Factor in individual team member skills and availability.

## Try it

```bash
npx po-skills -g
```

The repo is open source (Apache 2.0): **[github.com/GusY2K/po-skills](https://github.com/GusY2K/po-skills)**

If this saves you time, star the repo. If something breaks, open an issue. If you want to add a skill, PRs are welcome — each skill is just a `SKILL.md` file with instructions.

I'd love to hear how other POs and dev leads are handling backlog creation at scale. What's your current workflow? Drop a comment.

---

*po-skills is free and open source. [npm](https://www.npmjs.com/package/po-skills) | [GitHub](https://github.com/GusY2K/po-skills)*
