# OMK Docs Spec Delta

## MODIFIED Requirements

### Requirement: Document Upload Idempotency
The system SHALL handle duplicate document uploads idempotently to prevent client-side errors.

#### Scenario: Uploading a duplicate document
- **Given** a document with checksum X already exists
- **When** a user uploads a file with checksum X
- **Then** the system returns 200 OK
- **And** the response body contains the existing document data
- **And** the response body contains `exists: true`
- **And** the file is NOT duplicated in storage
