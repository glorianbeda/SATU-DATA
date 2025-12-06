# Tasks

## Task 1: Update Database Seed

- [x] Update `backend/prisma/seed.js` to use `SUPER_ADMIN`, `ADMIN`, `MEMBER`

## Task 2: Update Backend Role Checks

- [x] Update `backend/routers/api/GET__users/index.js` - adminRoles array
- [x] Update `backend/routers/api/users/GET__pending/index.js` - adminRoles array
- [x] Update `backend/routers/api/users/POST__approve/index.js` - adminRoles array
- [x] Update `backend/routers/api/users/POST__reject/index.js` - adminRoles array
- [x] Update `backend/routers/api/users/[id]/DELETE__index/index.js` - adminRoles array
- [x] Update `backend/routers/api/users/[id]/POST__resend-verification/index.js` - adminRoles array
- [x] Update `backend/routers/api/users/[id]/PUT__role/index.js` - adminRoles + super admin check
- [x] Update `backend/routers/api/users/[id]/PUT__index/index.js` - adminRoles array

## Task 3: Update Frontend RoleRoute

- [x] Update `RoleRoute` to extract role name correctly from API response
- [x] Ensure role name comparison works with new format

## Task 4: Cleanup MainLayout

- [x] Remove role name mapping since API now returns consistent format

## Task 5: Run Database Migration

- [x] Run SQL update to change role names in database
- [x] Verify roles are updated correctly

## Task 6: Verification

- [x] Test Super Admin can access User Management page
- [x] Test Admin cannot access User Management page
- [x] Test Member cannot access User Management page
