## ADDED Requirements

### Requirement: Role-Based Access Control (Backend)
The system MUST provide a middleware to restrict access to specific routes based on user roles.

#### Scenario: Admin Route Access
Given a user with role 'MEMBER'
When they access a route protected by `checkRole(['ADMIN'])`
Then the request MUST be rejected with 403 Forbidden

#### Scenario: Authorized Access
Given a user with role 'ADMIN'
When they access a route protected by `checkRole(['ADMIN'])`
Then the request MUST proceed

### Requirement: UI Role Adaptation
The frontend MUST correctly identify the user's role from the session profile to display appropriate menu items.

#### Scenario: Super Admin Menu
Given a user is logged in as SUPER_ADMIN
Then the sidebar MUST display "User Management" and "Finance" sections
