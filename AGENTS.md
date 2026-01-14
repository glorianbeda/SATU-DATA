# AGENTS.md

This file provides guidance to agents when working with code in this repository.

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Project-Specific Commands

**Backend (run from backend/ directory):**
- `yarn dev` - Start with nodemon (development)
- `yarn start` - Start production server
- `npx prisma migrate dev` - Run migrations
- `npx prisma db seed` - Seed database

**Frontend (run from frontend/ directory):**
- `yarn start` - Start dev server (Vite)
- `yarn build` - Production build
- `yarn lint` - Run ESLint
- `yarn make:page <path>` - Scaffold new page (e.g., `tools/productivity/notebook`)
- `yarn make:feature <name>` - Scaffold new feature with components/constants/interfaces
- `yarn make:module <name>` - Scaffold new module

**Docker:**
- `docker-compose up` - Start all services

## Critical Architecture Patterns

**Backend Routing (non-standard):**
Routes follow file-based convention: `routers/api/GET__login/index.js` → `GET /api/login`
- Pattern: `METHOD__name` (e.g., `POST__upload`, `GET__[id]`)
- Dynamic params: `[id]` becomes `:id` in Express routes
- Route handlers can export arrays of middleware: `module.exports = [authMiddleware, uploadPdf.single("file"), handler]`
- Module alias `@` points to backend root: `require("@/middleware/auth")`

**Frontend Routing:**
- Uses `vite-plugin-pages` for automatic route generation from `src/pages/`
- Routes are auto-generated: `src/pages/tools/productivity/notebook/index.jsx` → `/tools/productivity/notebook`
- Import routes with `import routes from '~react-pages'`

**Document Verification:**
- Documents use cryptographic verification via `backend/utils/documentCrypto.js`
- PDF verification metadata embedded in document properties (Title, Subject, Keywords), not visible QR codes
- Use `embedVerificationMetadata()` from `backend/utils/pdfQrCode.js` for signing

## Important Constraints

**Redis is DISABLED:**
- `backend/utils/cache.js` and `backend/utils/redis.js` are no-op stubs
- All cache operations return null immediately
- Do not rely on Redis functionality

**Authentication Flow:**
- User status flow: PENDING → APPROVED → VERIFIED
- Login requires `VERIFIED` status (PENDING=approval needed, APPROVED=email verification needed)
- JWT tokens stored in httpOnly cookies AND Authorization header fallback

**API Client:**
- Always use centralized API client from `frontend/src/utils/api.js`, never import axios directly
- Base URL defaults to `http://localhost:3001` (note port 3001, not 3000)

**Upload Limits:**
- Images: 5MB limit (use `backend/middleware/upload.js`)
- PDFs: 50MB limit (use `backend/middleware/uploadPdf.js`)

**i18n:**
- Default language is Indonesian (`id`), not English
- Translations in `frontend/src/locales/` (en.json, id.json)

**Package Manager:**
- Use `yarn` for all commands (not npm)
