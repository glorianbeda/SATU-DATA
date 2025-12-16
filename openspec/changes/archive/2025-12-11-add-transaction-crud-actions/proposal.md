# Add Transaction CRUD Actions

## Summary
Add Edit and Delete action buttons to the DataTable rows in Income and Expense pages.

## Problem
Currently, the Income and Expense tables display transaction data but lack row-level actions for editing and deleting individual records. Users can only add new transactions or use Quick Edit for bulk operations.

## Proposed Solution
Add an "Actions" column to the DataTable with Edit and Delete buttons for each row:

1. **Edit Action**: Opens a pre-filled TransactionModal to edit the selected transaction
2. **Delete Action**: Shows a confirmation dialog before deleting the transaction

## Scope
- **Frontend**: Income and Expense pages
- **Backend**: Existing PUT/DELETE endpoints already available at `/api/finance/transactions/:id`

## UI/UX
- Actions column on the right side of the table
- Edit: Icon button with edit icon, opens TransactionModal with existing data
- Delete: Icon button with delete icon, shows confirmation dialog
- Mobile card view: Actions displayed in each card
