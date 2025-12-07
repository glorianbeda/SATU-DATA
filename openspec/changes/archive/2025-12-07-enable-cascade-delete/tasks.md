1. **Backend: Update Prisma Schema**
   - [x] Modify `backend/prisma/schema.prisma` to add `onDelete: Cascade` to the following relations:
     - `User` -> `Role` (in `User` model)
     - `Document` -> `User` (uploader) (in `Document` model)
     - `SignatureRequest` -> `Document` (in `SignatureRequest` model)
     - `SignatureRequest` -> `User` (signer) (in `SignatureRequest` model)

2. **Backend: Create and Apply Migration**
   - [x] Run `npx prisma migrate dev --name enable_cascade_delete` in the `backend` directory.

3. **Validation**
   - [x] Verify that the migration file is created and applied successfully.
   - [x] (Optional) Verify via Prisma Studio or database client that deleting a User deletes their Documents.
