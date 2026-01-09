# Design: Finance Excel Features

## 1. Excel-like Quick Edit Grid
To achieve an Excel-like feel, we move beyond simple HTML inputs to a controlled Grid system.

### Interaction Model
- **Navigation**: Arrow keys move the `activeCell` focus.
- **Enter Key**:
    -   If in View Mode: Enters Edit Mode.
    -   If in Edit Mode: Saves (local state) and moves focus to the cell below.
- **Esc Key**: Cancels Edit Mode.
- **Tab Key**: Moves to next cell.
- **Paste Event**: Intercepts `onPaste` to parse tab-separated values (TSV) from Excel/Sheets and populates multiple cells relative to the active cell.

### Visual hierarchy
- **Desktop (Grid)**:
    -   Tight spacing (Dense mode).
    -   Borders: Light grey, but Active Cell gets a `2px solid primary` border.
    -   Clean inputs without default browser outlining.
- **Mobile (Card List)**:
    -   Grid is usability nightmare on phones.
    -   Fallback to "Card List" view.
    -   "Bulk Actions" remain available.
    -   Each card has inline "Edit" triggers or immediate input fields if space permits.

## 2. Robust Import Validation
Instead of just checking headers, we parse the entire dataset in the browser before sending to API.

### Validation Pipeline
1.  **File Read**: Parse XLSX/CSV to JSON.
2.  **Header Check**: Identify missing required columns (Case-insensitive fuzzy match).
3.  **Row Validation**: Iterate each row.
    -   **Date**: Must be valid Date object or parseable string.
    -   **Amount**: Must be numeric.
    -   **Category/Description**: Required strings.
4.  **Error Object**:
    -   Input: `[{ Date: '...', Amount: 'invalid' }]`
    -   Output:
        -   `validData`: `[...]`
        -   `invalidData`: `[{ row: 1, errors: { Amount: 'NaN' }, raw: {...} }]`
5.  **UI Feedback**:
    -   Preview Table renders ALL data.
    -   Cells with errors have `bg-red-50` and Tooltip explaining the error.
    -   Summary alert: "3 rows have errors. They will be skipped." (Or prompt to fix).

## 3. Shared Components
- Reuse the `TransactionValidation` logic from `QuickEdit` saving for `Import` validation to ensure consistency.
