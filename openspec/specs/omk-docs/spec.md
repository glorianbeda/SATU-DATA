# omk-docs Specification

## Purpose
TBD - created by archiving change add-omk-docs-signature. Update Purpose after archive.
## Requirements
### Requirement: Document Validation
The system SHALL validate documents using a checksum to ensure authenticity.

#### Scenario: Verify Real Document
- **WHEN** a document checksum is submitted for verification
- **THEN** the system MUST return the document details if it exists
- **AND** return "Invalid" if the checksum does not match any record

### Requirement: Signature Request
The system SHALL track the signed status of each request explicitly.

#### Scenario: Request Creation
- **WHEN** a signature request is created
- **THEN** `isSigned` MUST be set to `false`

#### Scenario: Signing
- **WHEN** a user signs a document
- **THEN** `isSigned` MUST be set to `true`
- **AND** `status` MUST be set to "SIGNED"

#### Scenario: Rejection
- **WHEN** a user rejects a request
- **THEN** `isSigned` MUST remain `false`
- **AND** `status` MUST be set to "REJECTED"

### Requirement: Signing Documents
The system SHALL allow users to sign all pending requests for a document in a single action.

#### Scenario: Batch Signing
- **GIVEN** a document with multiple pending signature requests for the current user
- **WHEN** the user clicks "Agree & Sign All"
- **THEN** all pending requests MUST be marked as signed
- **AND** the document MUST be updated with all signatures

### Requirement: Reject Signature
Users SHALL be able to reject a signature request.

#### Scenario: Rejection
- **WHEN** a user rejects a request
- **THEN** the request status MUST update to "Rejected"
- **AND** the requester MUST be notified

### Requirement: Document Upload
The system SHALL support uploading PDF documents up to 50MB.
The system SHALL display a progress bar during document upload.

#### Scenario: Large File Upload
- **GIVEN** a PDF file between 10MB and 50MB
- **WHEN** the user uploads the file
- **THEN** the upload MUST succeed
- **AND** a progress bar MUST indicate the upload status

### Requirement: Inbox Status Display
The system SHALL correctly display the status of signature requests in the Inbox.

#### Scenario: Signed Request
- **GIVEN** a signature request with status "SIGNED" or isSigned=true
- **WHEN** the user views the Inbox
- **THEN** the status chip MUST display "Signed"

### Requirement: Document Download
The system SHALL allow users to download documents from the Inbox.

#### Scenario: Download Document
- **GIVEN** a signature request in the Inbox
- **WHEN** the user clicks the "Download" button
- **THEN** the document MUST open in a new browser tab or start downloading

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

