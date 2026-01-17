# Tasks: Enhance Inventory Asset Management

## Phase 1: Database & Backend (Dependencies: None)

- [x] Create Prisma migration to make `serialNumber` unique
- [x] Update asset creation endpoint to require and validate unique `serialNumber`
- [x] Update asset edit endpoint to validate unique `serialNumber` (excluding self)

## Phase 2: Label Generation (Dependencies: Phase 1)

- [x] Add `serialNumber` to label HTML template in `LabelService.js`
- [x] Update label CSS to 3 columns per row (6cm × 3cm)
- [x] Adjust font sizes for compact layout

## Phase 3: ReusableTable Filters (Dependencies: None, can parallel)

- [x] Create `TableFilters` component with dropdown and dateRange support
- [x] Asset list page already has working category/status filters

## Phase 4: i18n Consistency (Dependencies: None, can parallel)

- [x] Added QR regeneration translation keys
- [x] Fixed duplicate `max_5mb` key in `id.json`

## Phase 5: QR Code Regeneration (Dependencies: None, can parallel)

- [x] Add backend endpoint `POST /api/inventory/assets/:id/regenerate-qr`
- [x] Add "Regenerate QR" button with GradientDialog confirmation
- [x] Add translations for regeneration UI

## Verification

- [x] Schema validated with unique `serialNumber`
- [x] Backend endpoint created and tested with curl
- [x] Labels now show S/N and print 3 per row
- [x] QR regeneration confirmation dialog implemented
