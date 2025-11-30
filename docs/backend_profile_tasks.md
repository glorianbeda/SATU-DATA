# Backend Profile Feature Implementation Tasks

## User Stories
1.  **Profile Picture Upload**
    *   As a user, I want to upload a profile picture so that I can personalize my account.
    *   The system should handle image file uploads (JPG, PNG, GIF).

2.  **Signature Upload & Processing**
    *   As a user, I want to upload a signature image or draw one manually.
    *   **Requirement:** If the uploaded signature has a background, the system should automatically remove it using a JS library (e.g., `@imgly/background-removal` on frontend or similar on backend).
    *   *Note:* Current implementation plan leans towards frontend background removal to save server processing, but backend should handle the storage of the processed image.

3.  **Update Name**
    *   As a user, I want to change my display name.

4.  **Change Password**
    *   As a user, I want to change my password.
    *   **Validation:** I must provide my old password for verification.
    *   **Validation:** I must confirm the new password.

5.  **Reusable Upload Handler**
    *   The file upload logic should be modular and reusable for future features (e.g., uploading documents, other images).

## Technical Tasks

### Database (Prisma)
- [x] **Update Schema:** Add `profilePicture` and `sign` columns to the `Admin` (or User) table.
    *   *Status:* Added to `backend/prisma/schema.prisma`.
- [x] **Migration:** Run `npx prisma migrate dev` to apply changes to the database.
- [x] **Generate Client:** Run `npx prisma generate` to update the Prisma Client.

### Backend (Node.js/Express)
- [x] **File Upload Middleware:**
    *   Implement a reusable `multer` configuration.
    *   Ensure it can handle different file types and destination folders.
- [x] **API Endpoints:**
    *   `PUT /api/profile`: Handle updates for name, profile picture, and signature.
    *   `PUT /api/profile/password`: Handle password changes.
        *   Verify `oldPassword` against the stored hash.
        *   Hash `newPassword` before saving.
- [x] **Static File Serving:**
    *   Ensure the upload directory (e.g., `uploads/`) is accessible via HTTP so frontend can display images.

### Frontend Integration (Refresher)
- [x] Ensure frontend sends `multipart/form-data` for file uploads.
- [x] Integrate background removal library (`@imgly/background-removal`) before sending the signature to the backend.
