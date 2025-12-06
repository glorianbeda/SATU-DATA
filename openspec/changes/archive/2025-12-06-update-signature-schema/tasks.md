## 1. Database
- [x] 1.1 Add `isSigned` Boolean to `SignatureRequest` in `schema.prisma`
- [x] 1.2 Run `prisma db push` (or migrate)

## 2. Backend
- [x] 2.1 Update `POST /api/documents/request-sign` (init `isSigned`)
- [x] 2.2 Update `POST /api/documents/sign` (update `isSigned`)
- [x] 2.3 Update `POST /api/documents/reject` (ensure `isSigned` is false)

## 3. Frontend
- [x] 3.1 Verify `Inbox` displays correct status
- [x] 3.2 Verify `ValidateDocument` displays correct status
