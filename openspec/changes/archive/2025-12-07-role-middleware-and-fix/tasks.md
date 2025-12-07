1. **Backend: Create Role Middleware**
   - [x] Create `backend/middleware/checkRole.js`.
   - [x] Implement a function that accepts allowed roles and returns a middleware checking `req.user.role`.

2. **Frontend: Fix MainLayout Profile Fetch**
   - [x] Modify `frontend/src/components/MainLayout.jsx`.
   - [x] Remove `localStorage.getItem('token')` check.
   - [x] Update `fetch` call to include `credentials: 'include'`.
   - [x] Ensure `userRole` extraction handles both object (`role.name`) and string (`role`).

3. **Frontend: Update Role Config (Optional but recommended)**
   - [x] Modify `frontend/src/config/roles.js` `hasPermission` function.
   - [x] Ensure it handles `userRole` as an object (e.g., `{ id: 1, name: 'SUPER_ADMIN' }`) by extracting the name.

4. **Validation**
   - [x] Verify that logging in as SUPER_ADMIN shows the "User Management" and "Finance" menus.
   - [x] Verify that the backend middleware exists (user can use it in routes later).
