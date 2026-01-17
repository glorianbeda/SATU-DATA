# Design: Improving Inventory System

## Architecture
No major architectural changes. We are utilizing the existing RBAC system and React frontend structure.

## Role: KOORDINATOR_INVENTARIS
This role is a subset of ADMIN permissions specific to the Inventory module.
- **DB**: Added to `Role` table.
- **Backend Permissions**:
  - `GET /api/inventory/*`: Allow
  - `POST/PUT/DELETE /api/inventory/*`: Allow
  - `POST /api/users`: Deny
- **Frontend Permissions**:
  - `canManageInventory`: true
  - `canApproveLoans`: true
  - `canViewAllLoans`: true
  - `canManageUsers`: false

## Super Admin Access Fix
The issue implies `SUPER_ADMIN` is restricted.
If `req.user.role` is an object `{ id, name }`, and middleware checks `req.user.role?.name`, it should work.
Potential cause: Some specific inventory routes might be missing `SUPER_ADMIN` in the allowed array, or verify `req.user.role` structure in `checkRole` middleware.

## Mobile Responsiveness
- **Lists**: Tables with many columns break on mobile.
  - **Solution**: Use `Hidden` or media queries to switch to a "Card List" view on `< sm` breakpoints.
- **Forms**: Ensure full width on mobile.

## I18n Strategy
- Namespace: `inventory` key in `en.json` and `id.json`.
- Pattern: `t('inventory.key_name')`.
