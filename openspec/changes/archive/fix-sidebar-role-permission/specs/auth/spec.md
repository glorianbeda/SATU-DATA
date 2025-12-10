# Auth Spec Delta - Role Permission Fix

## MODIFIED Requirements

### Requirement: Role data normalization in frontend
The frontend MUST normalize role data received from the API to match the `ROLES` constant keys for permission checks to work correctly.

#### Scenario: Super Admin role is correctly mapped
Given a user logs in with role "Super Admin"
When the profile API returns `{ role: { name: "Super Admin" } }`
Then MainLayout should transform it to `role: "SUPER_ADMIN"`
And Sidebar should show User Management menu
And Sidebar should show Finance menu

#### Scenario: Admin role is correctly mapped
Given a user logs in with role "Admin"
When the profile API returns `{ role: { name: "Admin" } }`
Then MainLayout should transform it to `role: "ADMIN"`
And Sidebar should NOT show User Management menu
And Sidebar should show Finance menu

#### Scenario: Member role is correctly mapped
Given a user logs in with role "Member"
When the profile API returns `{ role: { name: "Member" } }`
Then MainLayout should transform it to `role: "MEMBER"`
And Sidebar should NOT show User Management menu
And Sidebar should NOT show Finance menu

#### Scenario: Unknown role defaults to Member
Given a user logs in with an unknown role
When the profile API returns `{ role: { name: "Unknown" } }`
Then MainLayout should default to `role: "MEMBER"`
And Sidebar should NOT show privileged menus
