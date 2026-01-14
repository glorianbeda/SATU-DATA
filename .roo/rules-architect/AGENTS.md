# AGENTS.md - Architect Mode

This file provides guidance to agents when working with code in this repository.

## Architectural Constraints (Non-Obvious Only)

**Backend Routing Architecture:**
- Custom file-based routing system: `routers/api/GET__login/index.js` → `GET /api/login`
- Route pattern: `METHOD__name` where `[id]` becomes `:id` in Express routes
- Route handlers can export middleware arrays: `[authMiddleware, upload.single("file"), handler]`
- Routes are loaded recursively via custom `loadRoutesV2()` function in `backend/index.js`

**Frontend Routing Architecture:**
- Uses `vite-plugin-pages` for automatic route generation from `src/pages/`
- No manual route configuration needed - file structure determines routes
- Import routes with `import routes from '~react-pages'`

**Document Verification Architecture:**
- Cryptographic verification via `backend/utils/documentCrypto.js` (hash, HMAC signatures)
- PDF verification embedded in document properties (Title, Subject, Keywords), NOT visible QR codes
- Use `embedVerificationMetadata()` from `backend/utils/pdfQrCode.js` for signing
- Verification codes stored in `DocumentHash` model with originalHash and signedHash

**Hidden Architectural Decisions:**
- Redis is installed but completely disabled (no-op stubs in utils)
- Module alias `@` enables backend root imports via `module-alias` package
- Frontend uses centralized API client (`src/utils/api.js`) - direct axios imports are anti-pattern

**Authentication Architecture:**
- User status flow: PENDING → APPROVED → VERIFIED
- Login requires `VERIFIED` status only
- JWT tokens stored in httpOnly cookies AND Authorization header (fallback pattern)
- Role-based access control via `checkRole()` middleware and frontend `hasPermission()` helper

**Data Model Constraints:**
- MySQL database via Prisma ORM
- Document checksums are unique (enforced at schema level)
- Task lists have owner-based cascade deletion
- DocumentHash tracks original and signed hashes separately

**State Management Architecture:**
- Frontend uses React Context for global state (Alert, Theme, Layout, Confirmation)
- No Redux/Zustand - context providers are sufficient for current needs
- Alert system supports stacked notifications with auto-dismiss

**Upload Architecture:**
- Separate middleware for images (5MB) vs PDFs (50MB)
- Upload directories auto-created if missing
- File naming includes timestamp for uniqueness

**i18n Architecture:**
- Default language is Indonesian (`id`), not English
- Language preference stored in `localStorage` as `i18nextLng`
- Fallback to `id` if no saved preference

**Docker Architecture:**
- Backend maps to configurable `BACKEND_PORT` (internal port 3000)
- Frontend maps to configurable `FRONTEND_PORT` (internal port 5173)
- Frontend API URL hardcoded to `http://localhost:3001` in docker-compose.yml
- Redis service defined but not used by application code

**OpenSpec Integration:**
- Spec-driven development via `openspec/` directory
- Change proposals require approval before implementation
- See `openspec/AGENTS.md` for OpenSpec workflow details
