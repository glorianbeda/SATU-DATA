# AGENTS.md - Code Mode

This file provides guidance to agents when working with code in this repository.

## Backend Coding Rules (Non-Obvious Only)

**Routing Pattern:**
- Routes MUST follow `METHOD__name` convention in `backend/routers/api/` directory
- Example: `POST__upload/index.js` → `POST /api/upload`
- Dynamic params use `[id]` which converts to `:id` in Express routes
- Route handlers can export arrays: `module.exports = [authMiddleware, upload.single("file"), handler]`

**Module Imports:**
- Use `@` alias for backend root imports: `require("@/middleware/auth")`
- This is configured via `module-alias` in `backend/package.json`

**Upload Middleware:**
- Use `backend/middleware/upload.js` for images (5MB limit, image/* mime types only)
- Use `backend/middleware/uploadPdf.js` for PDFs (50MB limit, application/pdf only)
- Upload directories are auto-created if they don't exist

**Document Crypto:**
- Use `generateHash()` and `verifySignature()` from `backend/utils/documentCrypto.js` for document verification
- PDF signing uses `embedVerificationMetadata()` from `backend/utils/pdfQrCode.js`
- Verification is embedded in PDF properties (Title, Subject, Keywords), NOT visible QR codes

**Redis/Cache:**
- DO NOT use Redis - `backend/utils/cache.js` and `backend/utils/redis.js` are no-op stubs
- All cache operations return null immediately

**Prisma:**
- Run migrations from backend directory: `cd backend && npx prisma migrate dev`
- Seed database: `cd backend && npx prisma db seed`

## Frontend Coding Rules (Non-Obvious Only)

**API Calls:**
- ALWAYS use `frontend/src/utils/api.js` - never import axios directly
- Base URL is `http://localhost:3001` (not 3000)
- Credentials (cookies) are automatically included

**Scaffolding:**
- Use `yarn make:page <path>` to create new pages (e.g., `tools/productivity/notebook`)
- Use `yarn make:feature <name>` to create feature scaffolding with components/constants/interfaces
- Use `yarn make:module <name>` to create module scaffolding

**Routing:**
- Pages in `src/pages/` are auto-routed by `vite-plugin-pages`
- Import routes with `import routes from '~react-pages'`
- Nested paths work: `src/pages/tools/pdf/compress/index.jsx` → `/tools/pdf/compress`

**i18n:**
- Default language is Indonesian (`id`), not English
- Translation files in `src/locales/en.json` and `src/locales/id.json`
- Use `useTranslation()` hook from `react-i18next`

**Context Providers:**
- Use `useAlert()` from `AlertContext` for toast notifications
- Use `useTheme()` from `ThemeContext` for theme management
- Use `useLayout()` from `LayoutContext` for page title management

**Role-Based Access:**
- Check permissions with `hasPermission(userRole, permission)` from `src/config/roles.js`
- Permissions: `canManageUsers`, `canManageFinance`, `canSignDocs`, `canRequestDocs`, `canViewDashboard`

**Package Manager:**
- Use `yarn` for all commands (not npm)
