# po-skills Launch Strategy

## Launch Day Checklist

### Pre-Launch (before posting anywhere)
- [x] 4 skills complete and published on npm (v2.0.0)
- [x] README with banner, badges, install command above fold
- [x] CHANGELOG.md with semver
- [x] GitHub SEO: 12 topics, description, homepage
- [x] Social preview image (1280x640)
- [ ] Demo GIF in README (animated terminal showing the flow)
- [ ] Blog post on Dev.to (draft ready)
- [ ] Multi-runtime configs (Cursor, Copilot, Windsurf)

### Launch Day Posts (coordinate for same day)

**1. Reddit r/ClaudeAI**
```
Title: I built a skill that turns any document into a full Azure DevOps backlog — Epics, Features, Stories, Tasks with hierarchy

Body:
I was tired of spending hours manually creating work items from PRDs, so I built po-skills — a set of 4 agent skills that automate the entire Product Owner workflow in Azure DevOps.

What it does:
- Reads any document (PRD, spec, meeting notes) and creates the full backlog hierarchy
- Audits your existing backlog and gives it a health score (0-100)
- Plans sprints based on actual velocity and dependencies
- Generates standard work items from 18 templates (API endpoint, CRUD, auth, CI/CD...)

One command: npx y2k-labs -g

Works with Claude Code, Cursor, Copilot, Windsurf, and 40+ AI agents.

GitHub: https://github.com/GusY2K/y2k-labs
npm: https://www.npmjs.com/package/po-skills

Would love feedback from anyone working with Azure DevOps!
```

**2. Reddit r/azuredevops**
```
Title: Open-source AI tool that reads your PRD and creates the full backlog in Azure DevOps (Epics → Features → Stories → Tasks)

Body:
As a Product Owner, I was spending 2-3 hours per sprint manually creating work items from requirements documents. So I built an agent skill that does it automatically.

You give it a document, it:
1. Extracts the hierarchy (Epics, Features, User Stories, Tasks, Bugs)
2. Shows you the plan before touching anything
3. Creates everything in Azure DevOps with parent-child links
4. Verifies the hierarchy is correct

Also includes:
- Backlog health auditor (scores your backlog 0-100)
- Sprint planner (velocity-based)
- 18 work item templates

Uses az boards CLI under the hood. Open source, Apache 2.0.

npx y2k-labs -g

https://github.com/GusY2K/y2k-labs
```

**3. Hacker News (Show HN)**
```
Title: Show HN: po-skills – Document to Azure DevOps backlog with AI agent skills

URL: https://github.com/GusY2K/y2k-labs
```

**4. Twitter/X**
```
🚀 Just released po-skills v2.0 — 4 AI agent skills that automate the Product Owner workflow in Azure DevOps

📄 Document → Full backlog (Epics → Features → Stories → Tasks)
🏥 Backlog health audit (0-100 score)
📊 Sprint planner (velocity-based)
📝 18 work item templates

One command: npx y2k-labs -g

Works with Claude Code, Cursor, Copilot & 40+ AI agents

https://github.com/GusY2K/y2k-labs

#AzureDevOps #AI #AgentSkills #ClaudeCode #ProductOwner
```

**5. LinkedIn**
```
Product Owners: how much time do you spend manually creating work items in Azure DevOps?

I built po-skills — an open-source set of AI agent skills that automates the entire backlog workflow:

✅ Read any PRD/spec → create full backlog with hierarchy
✅ Audit existing backlog → health score with actionable fixes
✅ Plan sprints → velocity-based with dependency ordering
✅ 18 templates → API endpoint, CRUD, auth, CI/CD, and more

One command: npx y2k-labs -g

Compatible with Claude Code, Cursor, GitHub Copilot, Windsurf, and 40+ AI coding agents.

Apache 2.0 licensed. Feedback welcome.

https://github.com/GusY2K/y2k-labs

#ProductOwner #AzureDevOps #AI #Agile #Scrum #DevOps
```

**6. Dev.to** — Publish the blog post

### Post-Launch (week 1)
- Engage with every comment on Reddit/HN
- Share in relevant Discord servers (Claude Code community, Azure DevOps)
- If HN didn't take off, resubmit (allowed for low-score posts)
- Ask early adopters to star the repo

### Post-Launch (week 2-4)
- Write "vs" comparison post (po-skills vs Copilot4DevOps vs manual)
- Reach out to AI newsletter authors
- Cross-post to r/programming, r/webdev
- Record YouTube demo (3-5 min)
