# auth Specification

## Purpose
TBD - created by archiving change refactor-admin-to-user. Update Purpose after archive.
## Requirements
### Requirement: User Entity
The system SHALL store user accounts in a `User` table, distinct from specific roles.
**Reason**: To support multiple roles (Super Admin, Admin, Member) within a unified user management system.

#### Scenario: User Schema Definition
- **WHEN** the database schema is inspected
- **THEN** a `User` table MUST exist
- **AND** it MUST contain `email`, `password`, `name`, `roleId`
- **AND** it MUST NOT be named `Admin`

### Requirement: Role-Based Access
Users SHALL be assigned a role from the `Role` table.

#### Scenario: Role Assignment
- **WHEN** a user is created
- **THEN** they MUST be linked to a valid `Role`

### Requirement: User Registration
The system SHALL allow visitors to register for an account.

#### Scenario: Successful Registration
- **GIVEN** a visitor on the registration page
- **WHEN** they submit valid name, email, and password
- **THEN** a new user account is created with status "PENDING"
- **AND** the user is informed that their account is awaiting approval

### Requirement: Login Approval Check
The system SHALL prevent users with "PENDING" or "REJECTED" status from logging in.

#### Scenario: Pending User Login
- **GIVEN** a user with status "PENDING"
- **WHEN** they attempt to login with correct credentials
- **THEN** the system MUST deny access
- **AND** return an error message "Account is pending approval"

### Requirement: Email Verification
The system SHALL require users to verify their email after approval.

#### Scenario: Verify Email
- **GIVEN** a user with status "APPROVED" and a valid verification token
- **WHEN** they access the verification link
- **THEN** their status MUST update to "VERIFIED"
- **AND** they MUST be able to login

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

