# Restrict Admin Routes

## Summary
Implement a middleware (RoleRoute) to restrict access to sensitive routes like "User Management" to only users with the "SUPER_ADMIN" role.

## Background
Currently, routes are protected by authentication (`ProtectedRoute`), but not by role. Any logged-in user might access admin pages if they know the URL. We need to enforce role-based access control (RBAC) on the frontend.

## Goals
1. Create a `RoleRoute` component in `RouteGuard.jsx`.
2. Apply this guard to the User Management page.
3. Redirect unauthorized users to the dashboard.

## Plan
1. Update `RouteGuard.jsx` to fetch and check user role.
2. Create `RoleRoute` component that accepts `allowedRoles`.
3. Wrap `UserManagement` component with `RoleRoute`.
