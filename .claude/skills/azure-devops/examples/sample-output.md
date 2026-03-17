# Sample Output: Backlog Creation from sample-prd.md

## Backlog Creation Plan

**Document:** sample-prd.md
**Organization:** my-org
**Project:** MyProject
**Process Template:** agile
**Iteration:** MyProject\Sprint 1

### Hierarchy Preview

```
Epic 1: User Authentication & Authorization
  Feature 1.1: User Registration
    User Story 1.1.1: Register with email and password [SP: 5] [Priority: 2]
      Task 1.1.1.1: Create registration API endpoint (POST /auth/register)
      Task 1.1.1.2: Build registration form component
      Task 1.1.1.3: Implement email validation service
      Task 1.1.1.4: Add password strength indicator
      Task 1.1.1.5: Write unit tests for registration flow
    User Story 1.1.2: Verify email for account activation [SP: 3] [Priority: 2]
      Task 1.1.2.1: Create email verification endpoint
      Task 1.1.2.2: Build verification email template
      Task 1.1.2.3: Add resend verification button to login page
  Feature 1.2: User Login
    User Story 1.2.1: Log in with credentials [SP: 5] [Priority: 1]
      Task 1.2.1.1: Create login API endpoint
      Task 1.2.1.2: Build login form with validation
      Task 1.2.1.3: Implement JWT token generation and storage
      Task 1.2.1.4: Add rate limiting middleware
      Task 1.2.1.5: Write integration tests
  Feature 1.3: Password Recovery
    User Story 1.3.1: Reset password via email [SP: 5] [Priority: 2]
      Task 1.3.1.1: Create password reset request endpoint
      Task 1.3.1.2: Create password reset execution endpoint
      Task 1.3.1.3: Build reset password form
      Task 1.3.1.4: Implement session invalidation logic
  Feature 1.4: Role-Based Access Control
    User Story 1.4.1: Assign roles to control feature access [SP: 8] [Priority: 2]
      Task 1.4.1.1: Design roles and permissions database schema
      Task 1.4.1.2: Create role management API endpoints
      Task 1.4.1.3: Build admin role management UI
      Task 1.4.1.4: Implement role-based route protection middleware
      Task 1.4.1.5: Write E2E tests for permission scenarios
  Bug 1: Login page shows raw error stack on 500 [Priority: 1]

**Total: 1 Epic, 4 Features, 5 User Stories, 19 Tasks, 1 Bug = 30 items**
```

## After Creation

### Backlog Creation Complete

| Type | Planned | Created | Status |
|------|---------|---------|--------|
| Epics | 1 | 1 | PASS |
| Features | 4 | 4 | PASS |
| User Stories | 5 | 5 | PASS |
| Tasks | 19 | 19 | PASS |
| Bugs | 1 | 1 | PASS |

### Created Work Items

| ID | Type | Title | Parent ID |
|----|------|-------|-----------|
| 500 | Epic | User Authentication & Authorization | — |
| 501 | Feature | User Registration | 500 |
| 502 | Feature | User Login | 500 |
| 503 | Feature | Password Recovery | 500 |
| 504 | Feature | Role-Based Access Control | 500 |
| 505 | User Story | Register with email and password | 501 |
| 506 | User Story | Verify email for account activation | 501 |
| 507 | User Story | Log in with credentials | 502 |
| 508 | User Story | Reset password via email | 503 |
| 509 | User Story | Assign roles to control feature access | 504 |
| 510-528 | Task | (19 tasks) | (respective stories) |
| 529 | Bug | Login page shows raw error stack on 500 | 502 |

### Session Tag: `backlog-creator-20260317-143022`

### Quick Links
- Board: https://dev.azure.com/my-org/MyProject/_boards/board
- Backlog: https://dev.azure.com/my-org/MyProject/_backlogs
