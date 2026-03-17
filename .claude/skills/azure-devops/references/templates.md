# Work Item Templates

You are an expert Product Owner who generates standardized Azure DevOps work item hierarchies from proven templates. Each template encodes best practices for common software development patterns.

## Prerequisites

Same as `azure-devops-backlog-creator`. Verify `az boards` CLI access before starting.

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `$1` (positional) | Template name (see catalog below) | **Required** — show catalog if missing |
| `--title=<name>` | Custom name for the feature (e.g., "User Profile API") | Template default |
| `--org=<org>` | Azure DevOps organization | `az devops` default |
| `--project=<project>` | Azure DevOps project | `az devops` default |
| `--iteration=<path>` | Sprint/iteration path | Current iteration |
| `--area-path=<path>` | Area path | Project root |
| `--dry-run` | Preview without creating | `false` |
| `--type=<agile|scrum|basic>` | Process template | `agile` |

## Template Catalog

If no template is specified, show this catalog and ask the user to pick one:

### Backend

| Template | Description | Items |
|----------|-------------|-------|
| `api-endpoint` | REST API endpoint (CRUD or custom) | 1 Feature, 4 Stories, 12 Tasks |
| `database-migration` | Schema change with rollback plan | 1 Feature, 3 Stories, 9 Tasks |
| `background-job` | Scheduled/triggered async worker | 1 Feature, 3 Stories, 8 Tasks |
| `api-integration` | Third-party API integration | 1 Feature, 4 Stories, 11 Tasks |
| `microservice` | New microservice scaffold | 1 Feature, 5 Stories, 18 Tasks |

### Frontend

| Template | Description | Items |
|----------|-------------|-------|
| `frontend-page` | New page/view with routing | 1 Feature, 4 Stories, 13 Tasks |
| `form-workflow` | Multi-step form with validation | 1 Feature, 4 Stories, 14 Tasks |
| `dashboard` | Data dashboard with charts | 1 Feature, 5 Stories, 16 Tasks |
| `responsive-redesign` | Responsive overhaul of existing page | 1 Feature, 3 Stories, 10 Tasks |

### Full Stack

| Template | Description | Items |
|----------|-------------|-------|
| `crud-feature` | Complete CRUD (API + UI + DB) | 1 Feature, 6 Stories, 20 Tasks |
| `auth-flow` | Authentication/authorization flow | 1 Feature, 5 Stories, 17 Tasks |
| `search` | Search with filters and pagination | 1 Feature, 4 Stories, 14 Tasks |
| `file-upload` | File upload, storage, and retrieval | 1 Feature, 3 Stories, 11 Tasks |
| `notifications` | Notification system (email/push/in-app) | 1 Feature, 4 Stories, 13 Tasks |

### DevOps

| Template | Description | Items |
|----------|-------------|-------|
| `cicd-pipeline` | CI/CD pipeline setup | 1 Feature, 3 Stories, 10 Tasks |
| `monitoring` | Observability setup (logs, metrics, alerts) | 1 Feature, 3 Stories, 9 Tasks |
| `security-hardening` | Security audit and hardening | 1 Feature, 4 Stories, 12 Tasks |

### Bug Fix

| Template | Description | Items |
|----------|-------------|-------|
| `bug-fix` | Standard bug fix workflow | 1 Bug, 4 Tasks |
| `performance-fix` | Performance optimization cycle | 1 Feature, 3 Stories, 9 Tasks |

## Template Definitions

### api-endpoint

**Feature:** `<title> API Endpoint`

**User Story 1:** Design API contract [SP: 2, P: 1]
- AC: OpenAPI/Swagger spec defined for all endpoints
- AC: Request/response schemas documented
- AC: Error codes and messages specified
- Tasks:
  - Define request/response DTOs
  - Document endpoint in API spec
  - Review API design with team

**User Story 2:** Implement endpoint logic [SP: 5, P: 1]
- AC: Endpoint handles all CRUD operations per spec
- AC: Input validation with proper error messages
- AC: Database queries are parameterized (no SQL injection)
- AC: Response follows standard API format
- Tasks:
  - Create route/controller
  - Implement business logic/service layer
  - Add input validation (schema validation)
  - Implement database queries/repository
  - Add error handling and logging

**User Story 3:** Write tests [SP: 3, P: 2]
- AC: Unit tests cover business logic (80%+ coverage)
- AC: Integration tests cover API contract
- AC: Edge cases tested (empty input, invalid data, not found)
- Tasks:
  - Write unit tests for service layer
  - Write integration tests for endpoint
  - Write edge case / error path tests

**User Story 4:** Deploy and verify [SP: 2, P: 2]
- AC: Endpoint accessible in staging environment
- AC: Response times under SLA threshold
- Tasks:
  - Add to CI/CD pipeline
  - Deploy to staging
  - Verify with manual smoke test
  - Update API documentation

### crud-feature

**Feature:** `<title> (Full CRUD)`

**User Story 1:** Design data model [SP: 2, P: 1]
- AC: Database schema designed and reviewed
- AC: Relationships and constraints defined
- Tasks:
  - Design entity schema
  - Create migration script
  - Run migration in dev environment

**User Story 2:** Implement API endpoints [SP: 5, P: 1]
- AC: GET (list + detail), POST, PUT, DELETE endpoints working
- AC: Pagination on list endpoint
- AC: Input validation on create/update
- Tasks:
  - Create model/DTOs
  - Implement list endpoint with pagination
  - Implement detail endpoint
  - Implement create endpoint with validation
  - Implement update endpoint with validation
  - Implement delete endpoint (soft delete)

**User Story 3:** Build UI — List view [SP: 3, P: 1]
- AC: Table/grid displays all items with pagination
- AC: Sorting and filtering functional
- AC: Empty state displayed when no items
- Tasks:
  - Create list page component
  - Implement data fetching with loading state
  - Add pagination controls
  - Add sorting and filter controls
  - Style empty state

**User Story 4:** Build UI — Create/Edit form [SP: 3, P: 1]
- AC: Form validates all required fields
- AC: Success/error feedback displayed
- AC: Form works for both create and edit modes
- Tasks:
  - Create form component
  - Add field validation
  - Implement create API call
  - Implement edit API call with pre-population
  - Add success/error notifications

**User Story 5:** Build UI — Delete flow [SP: 2, P: 2]
- AC: Confirmation dialog before delete
- AC: Success message after deletion
- AC: List refreshes after delete
- Tasks:
  - Add delete button to list/detail
  - Create confirmation dialog
  - Implement delete API call
  - Handle optimistic UI update

**User Story 6:** Testing and QA [SP: 3, P: 2]
- AC: 80%+ test coverage on backend
- AC: E2E tests for create, read, update, delete flows
- Tasks:
  - Write backend unit tests
  - Write backend integration tests
  - Write frontend component tests
  - Write E2E tests (Playwright/Cypress)

### bug-fix

**Bug:** `<title>`
- Priority: 2
- Repro Steps: (to be filled by user)
- Expected: (to be filled by user)
- Actual: (to be filled by user)

**Tasks:**
1. Reproduce and document the bug [2h]
2. Identify root cause and write failing test [2h]
3. Implement fix (minimal change) [4h]
4. Verify fix passes test + regression suite [1h]

## Execution Flow

1. **Show template** — Display the full hierarchy for the selected template
2. **Customize** — Ask user if they want to modify titles, add/remove items, change points
3. **Confirm** — Wait for approval
4. **Create** — Same top-down creation as `azure-devops-backlog-creator` with parent-child links
5. **Verify** — Count check + link validation
6. **Report** — Summary with IDs and board links

## Adding Custom Templates

Users can define custom templates by creating a markdown file with this structure:

```markdown
# Template: <name>

## Feature: <title>

### User Story: <title> [SP: X, P: Y]
- AC: <criterion>
- AC: <criterion>
- Tasks:
  - <task title>
  - <task title>
```

Then invoke: `/work-item-templates path/to/custom-template.md`

## Important Rules

1. **Templates are starting points** — Always let the user customize before creating
2. **Story points are estimates** — Adjust based on team context
3. **Don't over-template** — If the user's needs don't fit any template, fall back to `azure-devops-backlog-creator` with their document
4. **Acceptance criteria are real** — Every AC must be testable and specific
5. **Tasks should be actionable** — Start with verbs, estimate hours when possible
