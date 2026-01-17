# pdf-edit Spec Delta

## ADDED Requirements

### Requirement: Organize Pages
Users SHALL be able to modify the page structure of a PDF.

#### Scenario: Reorder Pages
- **GIVEN** a PDF with pages [1, 2, 3]
- **WHEN** user drags page 3 to position 1
- **THEN** the saved PDF MUST have pages [3, 1, 2].

#### Scenario: Rotate Pages
- **WHEN** user rotates a page 90 degrees
- **THEN** the preview and saved file MUST reflect the rotation.

#### Scenario: Delete Pages
- **WHEN** user deletes a page
- **THEN** that page MUST be removed from the output PDF.
