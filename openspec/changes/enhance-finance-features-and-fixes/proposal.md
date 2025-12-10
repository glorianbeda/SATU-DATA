# Enhance Finance Features and Fixes

## Summary
Enhance the Quick Edit feature to provide a true spreadsheet-like experience and fix issues with PDF/CSV exports in the DataTable component.

## Motivation
The user requested a "spreadsheet mode" for Quick Edit and reported that PDF export is broken and CSV export is missing columns. These are critical for usability and data management.

## Impact
-   **Frontend**:
    -   `QuickEdit.jsx`: Major refactor for grid navigation and styling.
    -   `DataTable.jsx`: Fix export logic to include all columns and handle formatting.
    -   `Income.jsx` / `Expense.jsx`: Add `valueGetter` or similar for better export support.

## Risks
-   **Export**: Changing export logic might break existing exports if not careful with data types.
-   **Quick Edit**: Complex keyboard navigation can be buggy.
