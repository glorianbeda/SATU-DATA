# Proposal: Enhance Inventory Asset Management

## Background

The inventory system currently uses `assetCode` as the main identifier, with `serialNumber` as an optional field. Users need `serialNumber` to be the primary identifier for uniqueness validation and label printing. Additionally, the QR code label layout needs optimization (3 per row), and a reusable table component with column filters and date range is needed.

## Objective

1. **Serial Number as Primary Key**: Enforce uniqueness on `serialNumber` when adding assets
2. **QR Code Label Improvements**: 
   - Add serial number to printed labels
   - Change layout to 3 labels per row (adjusting dimensions as needed)
3. **QR Code Regeneration**: Allow regenerating QR codes with confirmation dialog
4. **Reusable Table Filters**: Create dropdown column filters and date range filters for tables
5. **i18n Consistency**: Audit and fix language consistency across inventory module

## Proposed Solution

### 1. Database Schema Changes
- Add unique constraint to `serialNumber` in `Asset` model
- Make `serialNumber` required for new assets

### 2. Label Generation Updates
- Include `serialNumber` in label HTML template
- Change CSS grid from 2 columns to 3 columns per row
- Adjust label dimensions to fit 3 per row (approximately 6cm x 3cm)

### 3. ReusableTable Component Enhancement
- Add configurable column dropdown filters
- Add date range picker for date columns
- Make filter configuration prop-driven

### 4. i18n Audit
- Review all inventory components for hardcoded strings
- Add missing translation keys to `id.json` and `en.json`

## Risks

- **Breaking Change**: Existing assets with null/duplicate serial numbers need migration
- **Label Size**: Smaller labels may reduce readability

## Alternatives Considered

- Keep `assetCode` as primary: Rejected because user explicitly wants serial number
- 2 labels per row: Rejected because user explicitly requested 3 per row
