## ADDED Requirements

### Requirement: User Management Access
Only users with the `SUPER_ADMIN` role MUST be able to access user management features.

#### Scenario: Unauthorized API Access
Given a user with role 'MEMBER' or 'ADMIN'
When they attempt to access `GET /api/users` or modify user roles
Then the system MUST respond with 403 Forbidden

#### Scenario: Unauthorized Page Access
Given a user with role 'MEMBER' or 'ADMIN'
When they attempt to navigate to `/admin/users`
Then the system MUST redirect them to the dashboard

#### Scenario: Authorized Access
Given a user with role 'SUPER_ADMIN'
When they access user management features
Then the system MUST allow the request
