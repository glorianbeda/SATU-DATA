# Enhance User Management

## Why

Currently, the application lacks:
1. A global alert/toast notification system for showing success/error messages consistently across all pages
2. Extended user management features beyond just approval (role management, user list, edit, delete)

## What Changes

### 1. Global Alert System (Snackbar/Toast)
- Create a global AlertProvider context using MUI Snackbar + Alert
- Provide `useAlert` hook for showing success/error/warning/info notifications
- Replace inline alerts with global toast notifications

### 2. Enhanced User Management
- **All Users Tab**: View all registered users (not just pending)
- **Role Management**: Change user roles (Super Admin, Admin, Member)
- **User Status**: View/filter by status (PENDING, APPROVED, VERIFIED, REJECTED)
- **Resend Verification**: Resend verification email for APPROVED users
- **Edit User**: Edit user name/email
- **Delete User**: Soft delete or deactivate users

## User Management Tabs
1. **Pending Users** - Current approval workflow
2. **All Users** - Full user list with search, filter, and actions
