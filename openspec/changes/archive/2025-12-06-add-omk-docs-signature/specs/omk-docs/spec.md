## ADDED Requirements

### Requirement: Document Validation
The system SHALL validate documents using a checksum to ensure authenticity.

#### Scenario: Verify Real Document
- **WHEN** a document checksum is submitted for verification
- **THEN** the system MUST return the document details if it exists
- **AND** return "Invalid" if the checksum does not match any record

### Requirement: Signature Request
Users SHALL be able to request signatures from other users by placing a signature box on a PDF.

#### Scenario: Request Signature
- **WHEN** a user uploads a PDF and selects a target user
- **AND** drags a signature box to a specific location
- **THEN** a signature request MUST be created for that user

### Requirement: Signing Documents
Users SHALL be able to sign documents assigned to them or self-sign.

#### Scenario: Apply Signature
- **WHEN** a user accepts a signature request
- **THEN** their stored signature MUST be applied to the document at the specified coordinates
- **AND** the document status MUST update to "Signed"

### Requirement: Reject Signature
Users SHALL be able to reject a signature request.

#### Scenario: Rejection
- **WHEN** a user rejects a request
- **THEN** the request status MUST update to "Rejected"
- **AND** the requester MUST be notified
