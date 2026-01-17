# Spec: Inventory Barcode Print

## ADDED Requirements

### Requirement: Barcode Label Generation
The system SHALL generate printable barcode labels for asset tracking using Code128 format.

#### Scenario: Single label generation
**Given** an admin is viewing an asset detail page  
**When** they click "Print Label"  
**Then** a printable label MUST be generated with:
- SatuData logo at the top
- Code128 barcode in the middle
- Asset serial number (assetCode) below the barcode

#### Scenario: Label dimensions
**Given** a barcode label is generated  
**Then** the label dimensions MUST be 3.5cm width x 7cm height

---

### Requirement: Batch Print Layout
The system SHALL support printing multiple labels on a single A4 page.

#### Scenario: A4 sheet layout
**Given** an admin selects multiple assets for printing  
**Then** labels MUST be arranged in a grid layout:
- 4 columns across
- 8 rows down
- Maximum 32 labels per A4 page

#### Scenario: Partial page handling
**Given** an admin selects 10 assets for printing  
**Then** the system MUST generate 10 labels on the first page  
**And** remaining grid positions SHALL be empty

---

### Requirement: Asset Selection for Printing
Admins SHALL be able to select specific assets for batch label printing.

#### Scenario: Multi-select in asset list
**Given** an admin is on the Asset Management page  
**When** they check multiple asset rows  
**Then** a "Print Selected" button MUST appear  
**And** clicking it SHALL open a print preview dialog

#### Scenario: Print from asset detail
**Given** an admin is viewing a single asset  
**Then** a "Print Label" button MUST be visible  
**And** clicking it SHALL generate a single label print preview

---

### Requirement: Barcode Scanning Integration
The system SHALL support barcode scanning for asset lookup.

#### Scenario: Scan to lookup asset
**Given** an admin scans a barcode using a scanner device  
**Then** the system MUST navigate to the corresponding asset detail page

#### Scenario: Scan for loan tracking
**Given** a user scans an asset barcode  
**Then** the system MUST show the asset's current status and loan history
