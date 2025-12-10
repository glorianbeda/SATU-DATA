# Tasks: Page Loading and Wallet UI

## Phase 1: Fix Page Loading Timing

- [x] Analyze current loading behavior in finance pages
- [x] Implement React.lazy for route-level code splitting
- [x] Add Suspense fallback with loading indicator
- [x] Ensure loading shows BEFORE data fetch starts
- [x] Test navigation from Pemasukan → Pengeluaran

## Phase 2: Wallet Backend

- [x] Add `FinanceSettings` model with `initialBalance` and `balanceDate`
- [x] Add `BalanceAuditLog` model for tracking changes
- [x] Run Prisma migration
- [x] Create `GET /api/finance/initial-balance` endpoint
- [x] Create `PUT /api/finance/initial-balance` endpoint (with audit log)
- [x] Create `GET /api/finance/balance-history` endpoint
- [x] Update balance calculation to filter by date

## Phase 3: Wallet Frontend

- [x] Create `WalletCard.jsx` with glassmorphism design
- [x] Create `EditBalanceModal.jsx` for editing balance + date
- [x] Create `BalanceHistoryModal.jsx` for audit log display
- [x] Update `balance.jsx` page with new components
- [x] Add i18n translations
- [x] Test full flow: view → edit → save → verify calculation

## Validation

- [x] Navigation shows immediate loading feedback
- [x] Balance calculation respects the date cutoff
- [x] Audit log records all changes correctly
