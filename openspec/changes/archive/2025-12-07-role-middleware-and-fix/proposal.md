# Role Middleware and Fix

## Summary
Implement a backend middleware for role-based access control and fix the frontend `MainLayout` to correctly fetch user profile using cookies, ensuring admin menus are visible.

## Motivation
The user reported two issues:
1.  "SUPER_ADMIN user management ga ada, finance ga ada" - This is because `MainLayout.jsx` is still trying to read a token from `localStorage` (which was removed) to fetch the user profile. It fails, defaults to `MEMBER` role, and hides admin menus.
2.  "buat suatu file handle middleware route berdasarkan role admin" - The user explicitly requested a backend middleware file to handle role-based route protection.

## Impact
-   **Backend**: Create `backend/middleware/checkRole.js`.
-   **Frontend**: Update `frontend/src/components/MainLayout.jsx` to use cookie-based authentication (`credentials: 'include'`).
-   **Frontend**: Update `frontend/src/config/roles.js` to robustly handle role objects vs strings.
