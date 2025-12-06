## 1. Global Alert System

- [x] 1.1 Create `AlertContext` and `AlertProvider` in `frontend/src/context/AlertContext.jsx`
- [x] 1.2 Create `useAlert` hook returning `{ showSuccess, showError, showWarning, showInfo }`
- [x] 1.3 Wrap App with `AlertProvider` in `App.jsx`
- [x] 1.4 Replace inline alerts in User Management with global alerts

## 2. Backend - User Management Endpoints

- [x] 2.1 Create `GET /api/users` - Get all users with pagination and filters
- [x] 2.2 Create `PUT /api/users/:id/role` - Update user role
- [x] 2.3 Create `PUT /api/users/:id` - Update user details (name, email)
- [x] 2.4 Create `DELETE /api/users/:id` - Delete/deactivate user
- [x] 2.5 Create `POST /api/users/:id/resend-verification` - Resend verification email

## 3. Frontend - Enhanced User Management Page

- [x] 3.1 Add tabs: "Pending Users" and "All Users"
- [x] 3.2 Create All Users tab with DataTable showing all users
- [x] 3.3 Add role dropdown/select to change user role
- [x] 3.4 Add status filter (PENDING, APPROVED, VERIFIED, REJECTED)
- [x] 3.5 Add Edit User modal
- [x] 3.6 Add Delete confirmation dialog
- [x] 3.7 Add Resend Verification button for APPROVED users

## 4. Integration

- [x] 4.1 Integrate global alerts throughout the app
- [x] 4.2 Test all user management flows
