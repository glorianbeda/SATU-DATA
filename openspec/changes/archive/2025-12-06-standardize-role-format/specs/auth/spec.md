# Auth Spec Delta - Standardize Role Format

## ADDED Requirements

### Requirement: Role naming convention

The system MUST use uppercase snake_case for role names consistently across backend and frontend.

#### Scenario: Role names use consistent format

Given the system has defined roles
Then all role names MUST be in uppercase snake_case format:
  - "SUPER_ADMIN" (not "Super Admin")
  - "ADMIN" (not "Admin")
  - "MEMBER" (not "Member")

#### Scenario: Database stores roles in standard format

Given the database Role table contains roles
Then role names MUST be stored as "SUPER_ADMIN", "ADMIN", "MEMBER"

#### Scenario: API returns role in standard format

Given a user requests their profile via GET /api/profile
When the API returns the user data
Then role.name MUST be in uppercase snake_case format (e.g., "SUPER_ADMIN")

#### Scenario: Frontend role checks match API format

Given the frontend uses RoleRoute with allowedRoles=['SUPER_ADMIN']
When a SUPER_ADMIN user accesses the protected route
Then the role check MUST pass because formats match exactly
