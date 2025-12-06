# Move Profile to Header

## Summary
Relocate the user profile and logout functionality from the bottom of the Sidebar to the Header.

## Background
The user wants a cleaner sidebar and a more standard top-right profile menu in the header. This menu will provide quick access to "Edit Profile" and "Logout".

## Goals
1. Remove profile section from Sidebar.
2. Add profile avatar/name to Header (top right).
3. Clicking profile shows a dropdown with "Edit Profile" and "Logout".
4. Ensure user data is available to both components (likely via lifting state or context).

## Plan
1. Lift user profile fetching state to `AppLayout` and `DashboardLayout`.
2. Pass `user` data down to `Sidebar` (for RBAC) and `Header` (for display).
3. Remove profile UI from `Sidebar`.
4. Implement profile dropdown in `Header`.
