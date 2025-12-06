## 1. Database & Backend
- [x] 1.1 Add `Document` and `SignatureRequest` models to `schema.prisma`
- [x] 1.2 Implement `POST /api/documents/upload` (PDF only, generate checksum)
- [x] 1.3 Implement `POST /api/documents/request-sign` (Target user, coordinates)
- [x] 1.4 Implement `POST /api/documents/sign` (Apply signature, update status)
- [x] 1.5 Implement `POST /api/documents/reject`
- [x] 1.6 Implement `GET /api/documents/validate/:checksum`

## 2. Frontend
- [x] 2.1 Create `DocumentUpload` component (PDF constraint)
- [x] 2.2 Create `SignaturePlacer` component (PDF Viewer + Drag & Drop)
- [x] 2.3 Create `Inbox` for signature requests
- [x] 2.4 Implement Signing interface (Self-sign & Others)
