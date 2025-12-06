# Tasks

## Task 1: Fix Role Transformation in MainLayout

- [x] Update `MainLayout.jsx` to transform `role.name` to role key constant
- [x] Add mapping from "Super Admin" → "SUPER_ADMIN", "Admin" → "ADMIN", "Member" → "MEMBER"
- [x] Ensure fallback to `ROLES.MEMBER` if role is undefined

## Task 2: Verify Sidebar Permissions
- [x] Test login as Super Admin - should see User Management and Finance
- [x] Test login as Admin - should see Finance but not User Management
- [x] Test login as Member - should not see User Management or Finance
