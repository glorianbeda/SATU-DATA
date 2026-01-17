# Tasks: Improve Inventory System

## Access Control
- [x] Add `KOORDINATOR_INVENTARIS` to `Role` seed in `backend/prisma/seed.js` <!-- id: seed-role -->
- [x] Update `frontend/src/config/roles.js` to include `KOORDINATOR_INVENTARIS` and define strict permissions <!-- id: frontend-roles -->
- [x] Update backend `checkRole` usage in `backend/routers/api/inventory/**/*.js` to include `KOORDINATOR_INVENTARIS` <!-- id: backend-roles -->
- [x] Verify and fix `SUPER_ADMIN` access logic in `backend/middleware/checkRole.js` if necessary <!-- id: fix-superadmin -->

## UI/UX Polish
- [x] Scan `frontend/src/pages/inventory` for hardcoded strings and extract to `locales` <!-- id: i18n-scan -->
- [x] Verify `DataTable.jsx` supports necessary customization (actions, custom rendering) <!-- id: check-datatable -->
- [x] Refactor `AssetTable.jsx` (or page) to use `DataTable` component <!-- id: migrate-assets -->
- [x] Refactor `LoanTable.jsx` (or page) to use `DataTable` component <!-- id: migrate-loans -->
- [x] Verify `DataTable` mobile view works correctly for these implementations <!-- id: verify-mobile-table -->
- [x] Ensure all forms in `frontend/src/pages/inventory` are responsive <!-- id: mobile-forms -->
