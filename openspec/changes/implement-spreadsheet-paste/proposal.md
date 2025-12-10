# Implement Spreadsheet Paste and Row Handling

## Summary
Implement spreadsheet-like copy-paste functionality in the Quick Edit page, allowing users to paste multi-row and multi-column data. The system will automatically create new rows to accommodate the pasted data.

## Motivation
The user wants a more efficient way to input data, specifically by copying from external sources (like Excel) and pasting into the Quick Edit grid. They also emphasized that adding rows should flow downwards.

## Impact
-   **Frontend**:
    -   `QuickEdit.jsx`: Add `onPaste` handler to inputs.
    -   Implement logic to parse TSV (Tab Separated Values) from clipboard.
    -   Update state to merge pasted data and append new rows.

## Risks
-   **Data Validation**: Pasted data might be invalid (e.g. text in amount field). Basic validation or sanitization is needed.
-   **Performance**: Pasting a huge amount of data might freeze the UI. We should limit or handle it gracefully (though standard usage is likely < 100 rows).
