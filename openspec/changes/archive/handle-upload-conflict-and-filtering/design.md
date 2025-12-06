# Design: Handle Upload Conflict and Filtering

## Architecture
- **Backend**:
  - `POST /api/documents/upload`: Check checksum. If exists, return 200 OK with `{ ..., exists: true }`.
  - `GET /api/users`: Add `exclude_self` query param. If true, add `id: { not: req.user.id }` to Prisma where clause.
- **Frontend**:
  - `DocumentUploadStep`: Check for `response.data.exists`. If true, show "Document exists" message but proceed as success.
  - `SignerSetupPanel`: Fetch users with `exclude_self=true`. This simplifies the component logic.

## Trade-offs
- **Idempotency vs Error**: Returning 200 for duplicates masks the "error", but for this use case (requesting signature on a doc), reusing the existing doc is the desired behavior.
