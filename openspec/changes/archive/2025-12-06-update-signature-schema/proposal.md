# Update Signature Schema

## Why
The user requested a database schema update to explicitly track whether a signature request has been signed (`isSigned`) and to ensure the linkage between `Document` and the requested `User` is clear. While the current `SignatureRequest` model handles the many-to-many relationship and `status` field, adding an explicit `isSigned` boolean aligns with the user's mental model and simplifies frontend logic for "signed/not signed" checks.

## What
1.  **Database**:
    - Modify `SignatureRequest` model in `schema.prisma`:
        - Add `isSigned` Boolean field (default: `false`).
2.  **Backend**:
    - Update `POST /api/documents/request-sign` to initialize `isSigned: false`.
    - Update `POST /api/documents/sign` to set `isSigned: true` (in addition to `status: "SIGNED"`).
    - Update `POST /api/documents/reject` to set `isSigned: false` (and `status: "REJECTED"`).
3.  **Frontend**:
    - Update `Inbox` and `ValidateDocument` to use `isSigned` for status checks where appropriate (or continue using `status` for full context).

## Impact
- **Database**: Migration required for `SignatureRequest`.
- **Backend**: Minor updates to 3 endpoints.
- **Frontend**: Minor updates to consumption logic (optional, can still use status).

## Alternative Considered
We could rely solely on `status` (PENDING, SIGNED, REJECTED). However, the user explicitly requested `isSigned`. Adding it provides a simple binary flag that might be useful for quick filtering or indexing in the future.
