1. **Implement Paste Handler**
   - [x] Update `frontend/src/pages/quick-edit.jsx`.
   - [x] Add `handlePaste` function.
   - [x] Parse clipboard text (split by `\n` and `\t`).
   - [x] Calculate target cells based on cursor position.
   - [x] Update `transactions` state:
     - [x] Update existing rows.
     - [x] Create new rows if paste extends beyond current count.
   - [x] Ensure `amount` is parsed correctly (remove non-numeric if needed, or let input handle it).

2. **Validation**
   - [x] Verify pasting single cell works.
   - [x] Verify pasting a row works.
   - [x] Verify pasting multiple rows (including creating new ones) works.
   - [x] Verify pasting into the middle of the table works.
