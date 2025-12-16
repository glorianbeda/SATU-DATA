# Fix Auth and UI Issues

## Why
Users are experiencing issues with logout (cookies not clearing), missing logout confirmation, and UI glitches on mobile (responsive table) and login page (dark mode, alignment). These issues degrade the user experience and security.

## What Changes
1.  **Auth Security**: Explicitly set `path: '/'` when setting and clearing the auth token cookie to ensure consistent behavior across all routes.
2.  **Auth UI**:
    *   Implement a confirmation modal for logout in the Sidebar.
    *   Fix the Login Page background color in dark mode.
    *   Center the Login Form inputs and ensure proper width.
3.  **UI Components**:
    *   Enhance `DataTable` responsiveness for mobile devices by ensuring horizontal scrolling works correctly.

## User Review Required
> [!NOTE]
> Logout will now require a confirmation click.
> The login page will now respect the system/app dark mode setting.
