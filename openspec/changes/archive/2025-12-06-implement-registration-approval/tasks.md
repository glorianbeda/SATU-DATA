## 1. Database Changes
- [x] 1.1 Add `status` string field to `User` model in `schema.prisma` with default "PENDING".
- [x] 1.2 Add `verificationToken` string field (optional) to `User` model.
- [x] 1.3 Run `npx prisma db push` (or migrate) to update the database.

## 2. Backend Implementation
- [x] 2.1 Add `resend` package and configure `RESEND_API_KEY` in `.env`.
- [x] 2.2 Create `backend/routers/api/POST__register/index.js` to handle user registration (create user with PENDING status).
- [x] 2.3 Update `backend/routers/api/POST__login/index.js` to check if `user.status === 'VERIFIED'`.
- [x] 2.4 Create `backend/routers/api/users/GET__pending/index.js` to list pending users (Admin only).
- [x] 2.5 Create `backend/routers/api/users/POST__approve/index.js` to approve a user.
    - Update status to `APPROVED`.
    - Generate `verificationToken`.
    - Send verification email using Resend.
- [x] 2.6 Create `backend/routers/api/users/POST__reject/index.js` to reject a user (Admin only).
- [x] 2.7 Create `backend/routers/api/GET__verify-email/index.js` to verify token and update status to `VERIFIED`.
- [x] 2.8 Register new routes in `backend/index.js`.

## 3. Frontend Implementation
- [x] 3.1 Create `frontend/src/pages/Register.jsx` with a registration form.
- [x] 3.2 Add `/register` route in `frontend/src/App.jsx`.
- [x] 3.3 Create `frontend/src/features/admin/components/UserManagement.jsx` to list and manage pending users.
- [x] 3.4 Add `/admin/users` route in `frontend/src/App.jsx` (protected for Admin).
- [x] 3.5 Add "User Management" link to Sidebar for Admins.
- [x] 3.6 Create `frontend/src/pages/VerifyEmail.jsx` to handle the verification link from email.
- [x] 3.7 Add `/verify-email` route in `frontend/src/App.jsx`.
