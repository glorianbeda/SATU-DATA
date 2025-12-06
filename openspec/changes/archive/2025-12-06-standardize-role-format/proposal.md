# Standardize Role Format

## Summary

Refactor role format to be consistent across backend and frontend using `SUPER_ADMIN`, `ADMIN`, `MEMBER` (uppercase snake_case) instead of "Super Admin", "Admin", "Member" (Title Case).

## Problem Statement

Currently, the system has inconsistent role naming:

- **Database**: Stores role names as "Super Admin", "Admin", "Member" (Title Case with space)
- **Frontend Constants**: Defines roles as `SUPER_ADMIN`, `ADMIN`, `MEMBER` (uppercase snake_case)
- **RoleRoute Component**: Expects role to match `allowedRoles` array exactly

This causes `RoleRoute` to fail because:

1. API returns `{ role: { name: "Super Admin" } }`
2. `RoleRoute` checks if `"Super Admin"` is in `['SUPER_ADMIN']`
3. Comparison fails → User redirected to dashboard

## Proposed Solution

**Option A (Chosen): Refactor Database Role Names**

Update role names in the database to use uppercase snake_case:

- "Super Admin" → "SUPER_ADMIN"
- "Admin" → "ADMIN"
- "Member" → "MEMBER"

This provides:

- Consistency across the entire stack
- No need for mapping logic in frontend
- Cleaner code without transformation layers
- Future-proof for additional roles

**Affected Areas:**

1. `backend/prisma/seed.js` - Role creation
2. Backend route handlers that check `adminRoles`
3. Frontend `RoleRoute` - Will work without transformation
4. Frontend `MainLayout` - Can remove mapping logic

## Success Criteria

- Super Admin can access `/admin/users` page
- Role checks work consistently without frontend mapping
- All existing functionality preserved
