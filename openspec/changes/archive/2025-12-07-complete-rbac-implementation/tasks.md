1. **Backend: Protect User Management Routes**
   - [x] Apply `checkRole(['SUPER_ADMIN'])` to:
     - [x] `backend/routers/api/GET__users/index.js`
     - [x] `backend/routers/api/users/GET__pending/index.js`
     - [x] `backend/routers/api/users/POST__approve/index.js`
     - [x] `backend/routers/api/users/POST__reject/index.js`
     - [x] `backend/routers/api/users/[id]/PUT__role/index.js`
     - [x] `backend/routers/api/users/[id]/DELETE__index/index.js`

2. **Frontend: Protect User Management Page**
   - [x] Modify `frontend/src/pages/admin/users.jsx`.
   - [x] Wrap the page content with `RoleRoute` component, allowing only `SUPER_ADMIN`.

3. **Validation**
   - [x] Verify that a MEMBER user cannot access `/admin/users` (redirects to dashboard).
   - [x] Verify that a MEMBER user cannot call the backend API endpoints (returns 403).
   - [x] Verify that SUPER_ADMIN can access both.
