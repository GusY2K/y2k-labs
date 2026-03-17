<div align="center">

# Y2K LABS

**Agent skills for the entire software development lifecycle. Azure DevOps automation, backlog creation from documents, sprint planning, health auditing, and work item templates.**

**Built for Claude Code, Cursor, GitHub Copilot, Windsurf, Cline, and [40+ AI agents](https://github.com/vercel-labs/skills).**

[![npm version](https://img.shields.io/npm/v/y2k-labs?style=for-the-badge&logo=npm&logoColor=white&color=00F0A0)](https://www.npmjs.com/package/y2k-labs)
[![npm downloads](https://img.shields.io/npm/dm/y2k-labs?style=for-the-badge&logo=npm&logoColor=white&color=00F0A0)](https://www.npmjs.com/package/y2k-labs)
[![Tests](https://img.shields.io/github/actions/workflow/status/GusY2K/y2k-labs/test.yml?branch=main&style=for-the-badge&logo=github&label=Tests)](https://github.com/GusY2K/y2k-labs/actions/workflows/test.yml)
[![GitHub stars](https://img.shields.io/github/stars/GusY2K/y2k-labs?style=for-the-badge&logo=github&color=00F0A0)](https://github.com/GusY2K/y2k-labs)
[![License](https://img.shields.io/badge/license-Apache--2.0-00F0A0?style=for-the-badge)](LICENSE.txt)

<br>

```bash
npx y2k-labs -g
```

**Works on Mac, Windows, and Linux.**

<br>

<img src="assets/banner-preview.png" alt="Y2K Labs terminal" width="600">

<br>

</div>

---

## Skills

### [azure-devops](./skills/azure-devops/)

Complete Azure DevOps automation — one skill that does everything:

| Capability | Description |
|-----------|-------------|
| **Backlog Creator** | Reads any document (PRD, spec, meeting notes) and creates a full hierarchy: Epics → Features → Stories → Tasks → Bugs with links, acceptance criteria, and story points |
| **Health Audit** | Scans your existing backlog and generates a 0-100 health score with 12 audit rules across 4 severity levels |
| **Sprint Planner** | Suggests optimal sprint assignments based on team velocity, priority ordering, and dependency analysis |
| **Templates** | 18 pre-built templates: API endpoint, CRUD feature, auth flow, database migration, CI/CD pipeline, and more |
| **CLI Reference** | Complete guide for `az boards`, `az repos`, `az pipelines` with examples, patterns, and best practices |

<!-- ### frontend (coming soon) -->
<!-- ### backend (coming soon) -->
<!-- ### devops (coming soon) -->
<!-- ### testing (coming soon) -->

---

## How Skills Work

Each skill is a `SKILL.md` file that gives your AI agent specialized knowledge. When you install Y2K Labs, the skills are copied to your agent's config directory. The agent loads them automatically based on context.

**Slash command:**
```
/azure-devops path/to/document.md
```

**Natural language (auto-detected):**
> "Read this PRD and create the backlog in Azure DevOps"
>
> "Audit my backlog health"
>
> "Plan the next 3 sprints"
>
> "Create a CRUD feature template for Products"

---

## Update

```bash
npx y2k-labs@latest -g
```

---

## Multi-Runtime Support

The installer creates the correct config files for each runtime automatically:

| Runtime | Config Location |
|---------|----------------|
| **Claude Code** | `~/.claude/skills/<name>/` |
| **Cursor** | `.cursor/rules/` |
| **GitHub Copilot** | `.github/copilot-instructions/` |
| **Windsurf** | `.windsurf/rules/` |
| **Cline** | `~/.cline/skills/<name>/` |

```bash
npx y2k-labs -g --agent=cursor
npx y2k-labs -g --agent=copilot
npx y2k-labs -g --agent=all
```

---

## Team Setup

```bash
# Everyone on the team runs:
npx y2k-labs -g
```

---

## Prerequisites (Azure DevOps skills)

| # | Requirement | Install |
|---|-------------|---------|
| 1 | Azure CLI | [Install guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) |
| 2 | DevOps extension | `az extension add --name azure-devops` |
| 3 | Authentication | `az login` or set `AZURE_DEVOPS_EXT_PAT` env var |
| 4 | Defaults | `az devops configure --defaults organization=https://dev.azure.com/ORG project=PROJECT` |

---

## Contributing

Want to add a skill? Every skill is a folder with a `SKILL.md`:

```
skills/
└── my-new-skill/
    ├── SKILL.md              # Required — frontmatter + instructions
    ├── references/            # Optional — detailed documentation
    ├── scripts/               # Optional — executable helpers
    ├── examples/              # Optional — sample inputs/outputs
    └── assets/                # Optional — templates, data files
```

1. Fork this repo
2. Create your skill folder in `skills/`
3. Add a `SKILL.md` with `name` and `description` in YAML frontmatter
4. Update `.claude-plugin/marketplace.json`
5. Submit a PR

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## License

Apache-2.0 — see [LICENSE.txt](./LICENSE.txt)
