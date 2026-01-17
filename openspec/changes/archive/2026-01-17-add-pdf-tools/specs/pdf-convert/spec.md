# pdf-convert Spec Delta

## ADDED Requirements

### Requirement: PDF to Image
Users SHALL be able to convert PDF pages to images.

#### Scenario: Convert to JPG/PNG
- **WHEN** user selects "PDF to Image"
- **THEN** each page MUST be rendered as an image
- **AND** available for download.

### Requirement: Image to PDF
Users SHALL be able to convert images to a PDF document.

#### Scenario: Images to PDF
- **WHEN** user uploads multiple images
- **THEN** they MUST be compiled into a single PDF
- **AND** available for download.
