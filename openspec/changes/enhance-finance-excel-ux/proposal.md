# Encode Finance Excel-like UX

## Problem
The current Finance module's "Quick Edit" and "Import" features are functional but lack the robust interactivity users expect from data-intensive applications.
- **Quick Edit**: While it works, it doesn't feel "Excel-like". Navigation can be improved, and visual feedback for selection is minimal. Mobile experience, while present, needs refinement for responsiveness.
- **Import**: The validation is limited to header checking. Users don't get detailed feedback on *which* rows or cells have errors (e.g., invalid amount format) until after a failed import or processed with null values.

## Solution
Enhance the Finance module to provide a premium, Excel-like experience.
1.  **Excel-like Quick Edit Grid**:
    -   Implement a dense, keyboard-navigable grid.
    -   Visual highlighting for active cells/rows.
    -   Mobile-first response layout (Card view with optimized touch editing).
2.  **Advanced Import Validation**:
    -   Row-level and Cell-level validation during preview.
    -   Visual error highlighting (Red cells) for invalid data.
    -   Clear "Missing Columns" feedback.
    -   Ability to see exactly what will be imported.

## Scopes
- `quick-edit`: Enhancements to the `QuickEdit` page interactions and UI.
- `import-validation`: Enhancements to the `ImportTransactionModal` logic and UI.
