# Role Based Access Control Spec

## ADDED Requirements

### Role Route Guard
The system MUST provide a way to restrict routes based on user roles.

#### Scenario: Super Admin accesses User Management
Given the user is logged in as "SUPER_ADMIN"
When they navigate to "/admin/users"
Then they should see the User Management page

#### Scenario: Regular user accesses User Management
Given the user is logged in as "MEMBER" or "ADMIN" (not SUPER_ADMIN)
When they navigate to "/admin/users"
Then they should be redirected to "/dashboard"
And a warning toast "Access denied" should be shown (optional)
