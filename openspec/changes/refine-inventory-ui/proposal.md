# Refine Inventory UI & Workflow

## Metadata
- **Change ID**: `refine-inventory-ui`
- **Created**: 2026-01-16
- **Status**: Draft
- **Supersedes**: `improve-inventory-system` (completed)

## Goal
Refine the Inventory Management system to provide a polished, professional UI with clear workflows for both administrators (managing assets) and regular users (borrowing assets).

## Context
The current inventory system is functional but has several UX issues:
1. **Duplicate Search**: Search field appears both in filter card AND inside DataTable
2. **Button Placement**: Add Asset and QR Scanner buttons are not aligned with header
3. **Missing i18n**: Some strings still hardcoded (e.g., table column headers)
4. **Unclear User Flow**: Users need clear guidance on how to request/borrow assets
5. **Table Information**: Need to show relevant dates (borrow date, due date) in loan tables

## Design Principles
1. **Single Source of Truth**: One search field per page (inside DataTable)
2. **Visual Hierarchy**: Primary actions (Add Asset, Scan QR) in page header
3. **Role-Based Views**: Different experiences for Admin vs Regular User
4. **Date Visibility**: Show loan/return dates in tables for tracking

---

## Capabilities

### `inventory-asset-ui`
**Goal**: Polish the Asset Management interface for admins.

**Key Changes**:
1. Remove duplicate search (use DataTable's built-in search only)
2. Move Add Asset & QR Scanner buttons to header row (aligned with title)
3. Keep category/status filters as dropdown pills below header
4. Complete i18n extraction for all strings
5. Improve empty state messaging

---

### `inventory-loan-flow`
**Goal**: Create clear borrowing workflow for users and approval workflow for admins.

**Key Changes**:
1. Add `borrowedDate` and `dueDate` columns to Loan Request table
2. Create visual status badges with clear meanings
3. Add user-facing loan history page
4. Improve loan detail page with timeline view
5. Add overdue highlighting for loans past due date

---

### `inventory-barcode-print`
**Goal**: Enable printing asset barcode labels for physical tracking.

**Key Changes**:
1. Generate barcode (Code128) instead of QR for compact size
2. Design label with SatuData logo + barcode + serial number
3. Label size: 3.5cm x 7cm
4. Batch print: Multiple labels per A4 sheet (4 columns x 8 rows)
5. Print dialog with asset selection
6. Barcode scanning integration for tracking

---

## Role Hierarchy (Reference)
```
SUPER_ADMIN → Full access to all features
ADMIN → Can manage assets, approve loans
KOORDINATOR_INVENTARIS → Can manage assets, approve loans (no user/finance access)
MEMBER → Can request loans only
```

## User Flows

### Admin Flow (Asset Management)
1. View Asset Dashboard → See stats overview
2. Go to Asset Management → View all assets with filters
3. Add New Asset → Fill form, save
4. Edit/Delete Asset → Manage existing assets
5. View Loan Requests → Approve/Reject pending requests

### User Flow (Borrowing)
1. View Available Assets → See what's available
2. Request Loan → Submit borrow request
3. Wait for Approval → Track status in "My Loans"
4. Receive Asset → Confirm receipt
5. Return Asset → Mark as returned

---

## Files Affected

### Frontend
- `frontend/src/pages/inventory/assets/index.jsx` - Remove duplicate search, fix button layout
- `frontend/src/pages/inventory/loans/index.jsx` - Add date columns
- `frontend/src/locales/en.json` - Complete translations
- `frontend/src/locales/id.json` - Complete translations

### No Backend Changes Required
The database schema already has all necessary date fields.
