# AGENTS.md - Ask Mode

This file provides guidance to agents when working with code in this repository.

## Project Context (Non-Obvious Only)

**Architecture Notes:**
- Backend uses custom file-based routing: `routers/api/GET__login/index.js` → `GET /api/login`
- Frontend uses `vite-plugin-pages` for automatic route generation from `src/pages/`
- Module alias `@` in backend points to `backend/` directory root
- Frontend alias `~` points to `src/` directory

**Counterintuitive Organization:**
- Backend routes follow `METHOD__name` pattern (not typical Express routing)
- Dynamic params use `[id]` in directory names, which becomes `:id` in routes
- Document verification is embedded in PDF metadata properties, NOT visible QR codes
- Redis is installed but completely disabled (no-op stubs in utils)

**Misleading File Locations:**
- Frontend API client is in `frontend/src/utils/api.js` (not a typical location)
- Upload middleware is split: `upload.js` for images, `uploadPdf.js` for PDFs
- Document crypto utilities are in `backend/utils/documentCrypto.js` and `backend/utils/pdfQrCode.js`

**Important Gotchas:**
- Default language is Indonesian (`id`), not English
- Backend API runs on port 3001 (not 3000) for frontend
- User login requires `VERIFIED` status (PENDING=needs approval, APPROVED=needs email verification)
- JWT tokens stored in both httpOnly cookies AND Authorization header (fallback)
- Upload limits: 5MB for images, 50MB for PDFs

**Hidden Dependencies:**
- `module-alias` package enables `@` imports in backend
- `vite-plugin-pages` enables file-based routing in frontend
- Document signing uses `pdf-lib` for metadata embedding

**Two Separate i18n Systems:**
- Frontend uses `i18next` with `src/locales/en.json` and `src/locales/id.json`
- Language preference stored in `localStorage` as `i18nextLng`
