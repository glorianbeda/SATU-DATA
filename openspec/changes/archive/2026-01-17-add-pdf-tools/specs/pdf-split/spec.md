# pdf-split Spec Delta

## ADDED Requirements

### Requirement: Split Document
Users SHALL be able to split a PDF into smaller files.

#### Scenario: Split by Range
- **GIVEN** a multi-page PDF
- **WHEN** user specifies ranges (e.g. "1-3, 5")
- **THEN** the system MUST extract those pages into separate PDF files
- **AND** provide them as a download (ZIP if multiple).
