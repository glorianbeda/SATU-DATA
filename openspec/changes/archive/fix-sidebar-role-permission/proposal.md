# Fix Sidebar Role Permission Bug

## Summary
After refactoring the sidebar to be global (via `MainLayout`), the User Management and Finance menu items are no longer visible for Super Admin users.

## Problem Statement
The sidebar uses `hasPermission(user.role, 'canManageUsers')` to conditionally render menu items. However, the role data passed from `MainLayout` is incorrectly formatted:

- **Backend returns**: `{ role: { name: "Super Admin" } }` (object with `name` property)
- **Frontend expects**: `role: "SUPER_ADMIN"` (string matching `ROLES` constant)

This mismatch causes `hasPermission()` to return `false` because `ROLE_PERMISSIONS["[object Object]"]` is undefined.

## Root Cause Analysis
1. `GET /api/profile` returns role as an object: `{ name: "Super Admin" }`
2. `MainLayout.jsx` stores `data.user.role` directly without transformation
3. `hasPermission()` expects a string key like `"SUPER_ADMIN"`, not `{ name: "Super Admin" }`
4. `ROLE_PERMISSIONS` uses uppercase snake_case keys: `SUPER_ADMIN`, `ADMIN`, `MEMBER`

## Proposed Solution
Transform the role data in `MainLayout.jsx` to map the role name to the correct `ROLES` constant:

```javascript
// Convert "Super Admin" -> "SUPER_ADMIN", "Admin" -> "ADMIN", "Member" -> "MEMBER"
const roleNameToKey = {
  'Super Admin': 'SUPER_ADMIN',
  'Admin': 'ADMIN', 
  'Member': 'MEMBER'
};
const userRole = roleNameToKey[data.user.role?.name] || ROLES.MEMBER;
```

## Affected Components
- `frontend/src/components/MainLayout.jsx` - Role transformation logic
- `frontend/src/components/Sidebar.jsx` - Already correctly uses `hasPermission(user.role, ...)`

## Success Criteria
- Super Admin can see User Management and Finance menus
- Admin can see Finance menu but not User Management
- Member cannot see User Management or Finance menus
