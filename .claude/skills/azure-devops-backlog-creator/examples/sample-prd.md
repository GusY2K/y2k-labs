# Sample PRD: User Authentication System

## Overview
Build a complete user authentication system with login, registration, password recovery, and role-based access control for the web application.

## Epic: User Authentication & Authorization

### Feature: User Registration
- **User Story:** As a new user, I want to register with email and password so I can access the platform
  - Acceptance Criteria:
    - Email must be validated (format + uniqueness)
    - Password must be 8+ characters with 1 uppercase, 1 number, 1 special char
    - User receives confirmation email after registration
    - Duplicate email shows clear error message
  - Tasks:
    - Create registration API endpoint (POST /auth/register)
    - Build registration form component
    - Implement email validation service
    - Add password strength indicator
    - Write unit tests for registration flow

- **User Story:** As a new user, I want to verify my email so my account is activated
  - Acceptance Criteria:
    - Verification link expires after 24 hours
    - User can request a new verification email
    - Account is marked as verified after clicking link
  - Tasks:
    - Create email verification endpoint (GET /auth/verify/:token)
    - Build verification email template
    - Add "Resend verification" button to login page

### Feature: User Login
- **User Story:** As a registered user, I want to log in with my credentials so I can access my account
  - Acceptance Criteria:
    - Login accepts email + password
    - Returns JWT token on success
    - Shows clear error on invalid credentials (without revealing which field is wrong)
    - Locks account after 5 failed attempts for 15 minutes
  - Tasks:
    - Create login API endpoint (POST /auth/login)
    - Build login form with validation
    - Implement JWT token generation and storage
    - Add rate limiting middleware
    - Write integration tests

### Feature: Password Recovery
- **User Story:** As a user who forgot my password, I want to reset it via email so I can regain access
  - Acceptance Criteria:
    - Reset link sent to registered email
    - Reset token expires after 1 hour
    - New password must meet strength requirements
    - All existing sessions invalidated after reset
  - Tasks:
    - Create password reset request endpoint (POST /auth/forgot-password)
    - Create password reset endpoint (POST /auth/reset-password)
    - Build reset password form
    - Implement session invalidation logic

### Feature: Role-Based Access Control
- **User Story:** As an admin, I want to assign roles to users so I can control access to features
  - Acceptance Criteria:
    - Three roles: admin, editor, viewer
    - Admin can assign/revoke roles
    - Role changes take effect immediately
    - API endpoints enforce role-based permissions
  - Tasks:
    - Design roles and permissions database schema
    - Create role management API endpoints
    - Build admin role management UI
    - Implement middleware for role-based route protection
    - Write E2E tests for permission scenarios

## Bug: Login page shows raw error stack on 500
- Repro Steps:
  1. Go to /login
  2. Enter valid email, any password
  3. Kill the auth service backend
  4. Click "Sign In"
- Expected: User-friendly error message
- Actual: Raw JSON error with stack trace displayed
- Priority: Critical
