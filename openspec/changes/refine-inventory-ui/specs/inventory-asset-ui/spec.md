# Spec: Inventory Asset UI

## ADDED Requirements

### Requirement: Unified Page Layout
The Asset Management page SHALL have a consistent layout with title and primary actions in the header row.

#### Scenario: Header with action buttons
**Given** an admin is on the Asset Management page  
**Then** the page title "Manajemen Aset" MUST be on the left  
**And** "Add Asset" and "Scan QR" buttons MUST be on the right of the same row  
**And** the buttons MUST be visually aligned with the title

#### Scenario: Single search field
**Given** an admin is on the Asset Management page  
**Then** there MUST be only ONE search field (inside DataTable)  
**And** there SHALL NOT be a duplicate search field in the filter card

---

### Requirement: Compact Filter Controls
Filter controls SHALL be compact pill-style dropdowns below the header.

#### Scenario: Filter dropdown styling
**Given** an admin is on the Asset Management page  
**Then** Status and Category filters MUST be compact Select components  
**And** filters MUST be in a single row below the header  
**And** default state SHALL show "All" for each filter

---

## MODIFIED Requirements

### Requirement: Complete Internationalization
All user-visible strings SHALL use i18n translation keys.

#### Scenario: Table column headers translated
**Given** a user views the Asset Management table  
**Then** all column headers MUST use translation keys  
**And** switching language MUST update all visible text

#### Scenario: Button labels translated
**Given** a user views the Asset Management page  
**Then** "Add Asset" button MUST display translated text  
**And** "Scan QR" button MUST display translated text
