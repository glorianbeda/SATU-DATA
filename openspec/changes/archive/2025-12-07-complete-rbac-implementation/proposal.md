# Complete RBAC Implementation

## Summary
Implement comprehensive Role-Based Access Control (RBAC) for both backend routes and frontend pages, specifically targeting User Management features for SUPER_ADMIN.

## Motivation
The user requested to "handle role biar bener gitu hak aksesnya baik frontend ataupu backend secara lengkap" (handle roles so access rights are correct for both frontend and backend completely). This follows the previous fix where we enabled the middleware; now we need to apply it to the sensitive routes.

## Impact
-   **Backend**: Apply `checkRole` middleware to `api/users` and related endpoints.
-   **Frontend**: Protect `admin/users` page with `RoleRoute`.
