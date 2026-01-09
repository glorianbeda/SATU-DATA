# document-integrity Spec Delta

## ADDED Requirements

### Requirement: Document Hash Storage
The system SHALL store cryptographic hashes of documents at key lifecycle stages.

#### Scenario: Original Hash on Upload
- **WHEN** a document is uploaded to the system
- **THEN** the system MUST calculate SHA-256 hash of the document
- **AND** store it as `originalHash` in `DocumentHash` table
- **AND** the hash MUST be linked to the document record

#### Scenario: Signed Hash After Completion
- **GIVEN** a document with all signature requests completed
- **WHEN** the QR code is embedded (final step)
- **THEN** the system MUST calculate SHA-256 hash of the modified document
- **AND** store it as `signedHash` in `DocumentHash` table

---

### Requirement: Server-Side Signature
The system SHALL create a server signature to prove documents were signed through the platform.

#### Scenario: HMAC Signature Creation
- **GIVEN** a document has completed all signatures
- **WHEN** the `signedHash` is stored
- **THEN** the system MUST create HMAC-SHA256 signature using server secret
- **AND** store it as `signatureData` in `DocumentHash` table

#### Scenario: Signature Verification
- **WHEN** verifying a document's authenticity
- **THEN** the system MUST recalculate HMAC from stored `signedHash`
- **AND** compare with stored `signatureData` using constant-time comparison
- **AND** return `isSignatureValid: true` if they match

---

### Requirement: File Upload Verification
The system SHALL allow users to verify documents by uploading the file directly.

#### Scenario: Matching Signed Document
- **GIVEN** a signed PDF document
- **WHEN** the user uploads the file for verification
- **THEN** the system MUST calculate SHA-256 of the uploaded file
- **AND** search for matching `signedHash` in `DocumentHash` table
- **AND** return document details and signer information if found

#### Scenario: Non-Matching Document
- **GIVEN** a PDF file that has been modified after signing
- **WHEN** the user uploads the file for verification
- **THEN** the system MUST return "Document not found or has been modified"
- **AND** indicate the document failed integrity verification

#### Scenario: Original Document Before Signing
- **GIVEN** the original uploaded document (before signatures)
- **WHEN** the user uploads the file for verification
- **THEN** the system MAY match against `originalHash`
- **AND** indicate the document has not been signed yet

---

## MODIFIED Requirements

### Requirement: Document Validation Response
The existing validation endpoint SHALL include hash verification information.

#### Scenario: Enhanced Validation Response
- **GIVEN** a valid verification code or checksum
- **WHEN** the system returns document details
- **THEN** the response MUST include:
  - `hashInfo.originalHash` (SHA-256 of uploaded doc)
  - `hashInfo.signedHash` (SHA-256 of signed doc, if available)
  - `hashInfo.isSignatureValid` (boolean, HMAC check result)
  - `hashInfo.algorithm` (e.g., "SHA256")
