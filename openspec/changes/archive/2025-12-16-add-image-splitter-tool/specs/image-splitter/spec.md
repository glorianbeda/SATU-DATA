## ADDED Requirements

### Requirement: Image Upload
The system SHALL provide an interface for users to upload an image file via drag-drop or file picker.

#### Scenario: User uploads a valid image
- **WHEN** user drops or selects a valid image file (PNG, JPG, WEBP)
- **THEN** the image is displayed in the preview canvas
- **AND** the grid overlay is rendered based on default row/column settings

#### Scenario: User uploads an invalid file
- **WHEN** user attempts to upload a non-image file
- **THEN** an error message is displayed
- **AND** the upload is rejected

---

### Requirement: Grid Configuration
The system SHALL allow users to configure the number of rows and columns for the image split grid, with each cell sized at A4 dimensions (210mm x 297mm portrait).

#### Scenario: User configures 2 rows and 3 columns
- **WHEN** user sets rows to 2 and columns to 3
- **THEN** the preview displays a 2x3 grid overlay
- **AND** each cell represents an A4-sized portion of the image

#### Scenario: User changes grid configuration
- **WHEN** user modifies the row or column values
- **THEN** the grid overlay updates immediately 
- **AND** the total print area dimensions are recalculated

---

### Requirement: Crop Area Positioning
The system SHALL allow users to reposition the crop area when the image is larger than the grid area by dragging the visible portion.

#### Scenario: Image is larger than grid area
- **WHEN** the uploaded image dimensions exceed the total grid area
- **THEN** the user can drag/pan the image to select which portion to split
- **AND** portions outside the grid area are excluded from the split

#### Scenario: Image fits within grid area
- **WHEN** the uploaded image fits within the grid area
- **THEN** the image is centered in the grid
- **AND** empty areas are filled with white/transparent background

---

### Requirement: Image Split Export
The system SHALL export each grid cell as a separate image file at A4 dimensions (2480 x 3508 pixels at 300 DPI).

#### Scenario: User exports split images
- **WHEN** user clicks the export button
- **THEN** each cell is extracted as a separate PNG file
- **AND** files are named with row and column indices (e.g., `split_1_2.png`)
- **AND** all files are bundled in a ZIP for download

#### Scenario: Preview before export
- **WHEN** user initiates export
- **THEN** a preview modal shows thumbnails of all cells
- **AND** user can confirm or cancel the export
