# omk-docs Specification

## ADDED Requirements

### Requirement: Document Upload
The system SHALL support uploading PDF documents up to 50MB.
The system SHALL display a progress bar during document upload.

#### Scenario: Large File Upload
- **GIVEN** a PDF file between 10MB and 50MB
- **WHEN** the user uploads the file
- **THEN** the upload MUST succeed
- **AND** a progress bar MUST indicate the upload status

## MODIFIED Requirements

### Requirement: Signature Request
The system SHALL provide clear instructions for placing signature fields.

#### Scenario: Placing Signature
- **WHEN** the user views the document to request a signature
- **THEN** the system MUST display instructions to "Drag and drop the signature box to the desired location".

### Requirement: Signing Documents
The system SHALL allow users to sign all pending requests for a document in a single action.

#### Scenario: Batch Signing
- **GIVEN** a document with multiple pending signature requests for the current user
- **WHEN** the user clicks "Agree & Sign All"
- **THEN** all pending requests MUST be marked as signed
- **AND** the document MUST be updated with all signatures
