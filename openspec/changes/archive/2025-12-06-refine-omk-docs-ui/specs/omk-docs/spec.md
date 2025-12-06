# omk-docs Specification

## ADDED Requirements

### Requirement: Sidebar Navigation
The OMK Docs feature SHALL be accessible via a collapsible sidebar menu with specific sub-options.

#### Scenario: Navigation Structure
- **WHEN** a user expands the "OMK Docs" sidebar menu
- **THEN** they MUST see "Minta tanda tangan", "Perlu Ditandatangani", and "Validasi dokumen" options
- **AND** clicking an option MUST navigate to the corresponding view without a full page reload

### Requirement: Document Validation UI
Users SHALL be able to validate documents via a dedicated frontend interface.

#### Scenario: Validate via UI
- **WHEN** a user navigates to "Validasi dokumen"
- **AND** enters a document checksum or uploads a file
- **THEN** the system MUST display the validation result (Valid/Invalid) and document details
