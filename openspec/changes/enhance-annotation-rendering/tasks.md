# Tasks

- [x] Update `backend/prisma/schema.prisma` to add `type`, `text`, `width`, `height` to `SignatureRequest`
- [x] Run `npx prisma migrate dev --name add_annotation_fields` (Used `db push` due to env issues)
- [x] Update `backend/routers/api/documents/POST__request-sign/index.js` to accept and save new fields
- [x] Update `backend/routers/api/documents/POST__sign/index.js` to handle text/date rendering and dynamic sizing
- [x] Update `frontend/src/features/omk-docs/components/wizard/ConfirmStep.jsx` to send `type`, `text`, `width`, `height` (normalized)
- [x] Verify signature resizing works
- [x] Verify text and date annotations appear on the final PDF
