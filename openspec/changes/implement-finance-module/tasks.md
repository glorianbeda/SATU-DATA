1. **Backend: Database Schema**
   - [x] Update `backend/prisma/schema.prisma` to add `Transaction` model.
   - [x] Run `npx prisma db push` to update the database.

2. **Backend: API Endpoints**
   - [x] Create `backend/routers/api/finance/transactions/GET__index/index.js` (List).
   - [x] Create `backend/routers/api/finance/transactions/POST__index/index.js` (Create).
   - [x] Create `backend/routers/api/finance/transactions/[id]/PUT__index/index.js` (Update).
   - [x] Create `backend/routers/api/finance/transactions/[id]/DELETE__index/index.js` (Delete).
   - [x] Create `backend/routers/api/finance/summary/GET__index/index.js` (Summary stats).

3. **Frontend: Finance Pages**
   - [x] Create `frontend/src/pages/finance/income.jsx` using `DataTable`.
   - [x] Create `frontend/src/pages/finance/expense.jsx` using `DataTable`.
   - [x] Create `frontend/src/pages/finance/balance.jsx` with summary cards and ApexCharts.

4. **Frontend: Sidebar & Dashboard**
   - [x] Update `frontend/src/components/Sidebar.jsx` to ensure correct structure (Income, Expense, Balance).
   - [x] Update `frontend/src/pages/dashboard.jsx` to fetch and display finance summary.

5. **Frontend: Quick Edit**
   - [x] Create `frontend/src/pages/quick-edit.jsx`.
   - [x] Implement a spreadsheet-like table for bulk editing transactions (Income/Expense).
   - [x] Implement bulk save functionality.

6. **Validation**
   - [x] Verify Income/Expense CRUD operations.
   - [x] Verify Balance calculation.
   - [x] Verify Charts rendering.
   - [x] Verify Dashboard integration.
   - [x] Verify Quick Edit functionality (bulk updates).
