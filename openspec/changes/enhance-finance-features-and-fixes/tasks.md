1. **Fix DataTable Export**
   - [x] Update `frontend/src/components/DataTable/DataTable.jsx`.
   - [x] Modify `exportToCSV` and `exportToPDF` to include columns with `renderCell`.
   - [x] Implement a `getValue` helper to extract exportable data (prefer `valueGetter` > `field` > empty).
   - [x] Ensure `jspdf-autotable` is correctly initialized.

2. **Update Finance Pages for Export**
   - [x] Update `frontend/src/pages/finance/income.jsx`.
   - [x] Update `frontend/src/pages/finance/expense.jsx`.
   - [x] Add `valueGetter` to columns (Date, Amount, Proof) to ensure correct export formatting.

3. **Enhance Quick Edit UI**
   - [x] Update `frontend/src/pages/quick-edit.jsx`.
   - [x] Implement keyboard navigation (Arrow keys to move focus).
   - [x] Style inputs to look like a seamless grid (remove padding/borders).
   - [x] Ensure "Add Row" and "Delete Row" work smoothly with the new layout.

4. **Validation**
   - [x] Verify PDF export works and contains all columns.
   - [x] Verify CSV export works and contains all columns.
   - [x] Verify Quick Edit behaves like a spreadsheet (navigation, editing).
