# Improve Inventory System

## Metadata
- **Change ID**: `improve-inventory-system`
- **Created**: 2026-01-16
- **Status**: Draft

## Goal
Improve the OMK Inventory system by refining the UI for mobile responsiveness, ensuring translation consistency, fixing access control issues for Super Admin, introducing a new `KOORDINATOR_INVENTARIS` role, and standardizing table components.

## Context
The current inventory system allows asset tracking and loan management. However, there are usability issues on mobile devices, translation inconsistencies, and access control bugs. Additionally, a dedicated role for inventory coordinators is needed. Tables need to be standardized using the existing `DataTable` component to ensure consistency and maintainability.

## Access Control Changes
1.  **New Role**: `KOORDINATOR_INVENTARIS`
    - Hierarchy: Member < Koordinator Inventaris < Admin < Super Admin.
    - Permissions: Manage assets/loans, no user/finance access.
2.  **Super Admin Fix**: Ensure `SUPER_ADMIN` can access all inventory routes.

## UI/UX Improvements
1.  **Mobile Responsiveness**:
    - Use `DataTable` component which supports mobile card view.
    - Ensure buttons and forms are responsive.
2.  **Standardization**:
    - All inventory tables must use `frontend/src/components/DataTable/DataTable.jsx`.
    - Ensure `DataTable` is flexible enough for custom actions.
3.  **Translations**:
    - Move hardcoded strings to `en.json` and `id.json`.

## Capabilities

### `inventory-access-control`
- **Goal**: Implement `KOORDINATOR_INVENTARIS` role and fix Super Admin access.
- **Files**:
  - `backend/prisma` (Role Enum/Seed)
  - `backend/middleware/checkRole.js`
  - `frontend/src/config/roles.js`

### `inventory-ui-polish`
- **Goal**: Improve mobile responsiveness, translation consistency, and standardize tables.
- **Files**:
  - `frontend/src/pages/inventory/**/*.jsx`
  - `frontend/src/components/DataTable/DataTable.jsx`
  - `frontend/src/locales/*.json`
