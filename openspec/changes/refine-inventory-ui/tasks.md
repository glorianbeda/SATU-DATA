# Tasks: Refine Inventory UI

## Asset UI Polish
- [x] Remove duplicate search field from assets page (keep only DataTable's search) <!-- id: remove-dup-search -->
- [x] Move Add Asset & QR Scanner buttons to header row, aligned with title <!-- id: fix-button-layout -->
- [x] Keep filter dropdowns (Status, Category) as compact pills below header <!-- id: compact-filters -->
- [x] Extract all hardcoded strings to i18n (en.json, id.json) <!-- id: complete-i18n -->
- [ ] Improve empty state with illustration and action prompt <!-- id: empty-state -->

## Loan Flow Improvements
- [x] Add Borrowed Date and Due Date columns to Loan Request table <!-- id: loan-date-cols -->
- [x] Add visual indicators for overdue loans (red highlight) <!-- id: overdue-highlight -->
- [x] Improve loan status badges with clear color meanings <!-- id: status-badges -->
- [ ] Add "My Loans" page for regular users to track their requests <!-- id: my-loans-page -->
- [ ] Add timeline view in loan detail page <!-- id: loan-timeline -->

## Barcode Label Printing
- [x] Create barcode generator using Code128 format (compact, scannable) <!-- id: barcode-gen -->
- [x] Design label template: SatuData logo + barcode + serial number (3.5cm x 7cm) <!-- id: label-design -->
- [x] Implement batch print dialog with asset selection <!-- id: batch-print-dialog -->
- [x] Generate A4 print layout (4 columns x 8 rows = 32 labels per page) <!-- id: a4-layout -->
- [x] Add "Print Label" button to asset detail page <!-- id: print-single -->
- [x] Add "Print Selected" option in asset list page <!-- id: print-bulk -->
- [ ] Integrate barcode scanner for asset tracking/lookup <!-- id: barcode-scan -->

## Loan Flow Improvements (continued)
- [x] Add "My Loans" page for regular users to track their requests <!-- id: my-loans-page -->
- [ ] Add timeline view in loan detail page <!-- id: loan-timeline -->

## Validation
- [ ] Test admin flow: Add Asset → View Table → Edit/Delete <!-- id: test-admin -->
- [ ] Test user flow: Request Loan → Track Status → Return <!-- id: test-user -->
- [ ] Test barcode print: Select Assets → Print → Scan to verify <!-- id: test-barcode -->
- [ ] Verify mobile responsiveness across all changes <!-- id: test-mobile -->
- [ ] Verify i18n completeness (all strings translated) <!-- id: test-i18n -->
