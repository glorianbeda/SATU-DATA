# Design: Enhance Inventory Asset Management

## Architecture Overview

This change spans multiple layers:
- **Database**: Prisma schema modifications
- **Backend**: Validation logic, label generation service
- **Frontend**: Asset forms, label components, reusable table

## Database Changes

### Asset Model Modifications
```prisma
model Asset {
  // ... existing fields
  serialNumber  String   @unique  // Changed from optional to required unique
  // ...
}
```

### Migration Strategy
1. Identify assets with null/empty `serialNumber`
2. Generate placeholder serial numbers for existing assets (e.g., `LEGACY-{assetCode}`)
3. Apply unique constraint

## Label Generation Updates

### New Label Dimensions
- Current: 7cm × 3.5cm, 2 per row
- New: ~6cm × 3cm, 3 per row on A4 page

### Label Content
Add `serialNumber` field below asset name:
```
┌─────────────────────────────────────┐
│ [LOGO] Satu Data+                   │
│ Asset Name                    [QR]  │
│ S/N: ABC123456                      │
│ CAT: Electronics                    │
│ LOC: Office A                       │
│ CODE: IT-LPT-001                    │
└─────────────────────────────────────┘
```

### CSS Grid Update
```css
.page {
  grid-template-columns: repeat(3, 6cm);
}
.label {
  width: 6cm;
  height: 3cm;
}
```

## ReusableTable Component

### Props Interface
```typescript
interface TableFilterConfig {
  column: string;
  type: 'dropdown' | 'dateRange' | 'text';
  options?: { value: string; label: string }[];
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  filters?: TableFilterConfig[];
  onFilterChange?: (filters: Record<string, any>) => void;
}
```

### Filter UI Components
- Dropdown: MUI Select with configured options
- Date Range: MUI DatePicker with start/end date

## i18n Audit Scope

Files to audit:
- `frontend/src/features/inventory/components/*.jsx`
- `frontend/src/features/inventory/pages/*.jsx`
- `frontend/src/locales/id.json` (inventory section)
- `frontend/src/locales/en.json` (inventory section)
