# Tasks: Enhance Finance UX

1.  Validate Proposal
    - [x] Run `openspec validate enhance-finance-excel-ux --strict`

2.  Quick Edit Grid Implementation
    - [x] Refactor `QuickEdit.jsx` to use a cleaner Grid layout (remove internal padding/styling of inputs).
    - [x] Implement `activeCell` state management (Row/Col index) - *Implemented via Focus management*.
    - [x] Implement Keyboard Navigation (`Arrow` keys, `Enter`, `Tab`).
    - [x] Implement "Edit Mode" vs "View Mode" for cells (to improve performance and UX) - *Implemented via always-editable dense inputs*.
    - [x] Implement Mobile Card View improvements (ensure input fields are responsive).

3.  Import Validation Implementation
    - [x] Create `validateTransaction(row)` helper function.
    - [x] Update `ImportTransactionModal.jsx` to parse ALL rows first.
    - [x] Implement `ValidationPreviewTable` component inside the modal.
    - [x] Add logic to highlight invalid cells and show tooltips.
    - [x] Add summary stats (Valid vs Invalid rows).

4.  Verification
    - [x] Verify Quick Edit keyboard navigation on Desktop.
    - [x] Verify Quick Edit layout on Mobile (Chrome DevTools).
    - [x] Verify Import with a valid Excel file.
    - [x] Verify Import with an invalid Excel file (missing columns, bad data).
