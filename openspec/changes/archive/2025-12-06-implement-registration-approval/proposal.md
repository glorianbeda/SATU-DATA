# Implement Registration and Approval Workflow

## Why
The user wants a public registration feature for their organization's web app, but with strict control over who can access the system.
The proposed solution is a "Register with Approval" workflow where users can sign up, but their accounts remain "PENDING" until approved by an Admin or Super Admin.

## What
1.  **Database**:
    - Add `status` field to `User` model (`PENDING`, `APPROVED`, `VERIFIED`, `REJECTED`).
    - Add `verificationToken` field to `User` model.
2.  **Backend**:
    - Add `resend` package.
    - Configure `RESEND_API_KEY` in `.env`.
    - Create `POST /api/register` endpoint.
    - Update `POST /api/login` to block non-VERIFIED users (or non-APPROVED if we want to allow login before verification, but user request implies verification is final step). Let's stick to: Register -> PENDING -> Admin Approve -> APPROVED (Email Sent) -> User Verify -> VERIFIED (Can Login).
    - Create endpoints for managing user approval (`GET /api/users/pending`, `POST /api/users/:id/approve`, `POST /api/users/:id/reject`).
    - Create `GET /api/verify-email` endpoint.
3.  **Frontend**:
    - Create a Registration page.
    - Create a User Management page for Admins.
    - Create a Verification Success/Fail page.

## Impact
- **Backend**: `schema.prisma`, `routers/api/POST__register`, `routers/api/POST__login`, `routers/api/users/...`, `routers/api/GET__verify-email`.
- **Frontend**: `Register.jsx`, `UserManagement.jsx`, `VerifyEmail.jsx`, `App.jsx` (routes).
- **Env**: Add `RESEND_API_KEY`.
