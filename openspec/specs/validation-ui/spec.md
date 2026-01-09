# validation-ui Specification

## Purpose
TBD - created by archiving change refine-crypto-verification. Update Purpose after archive.
## Requirements
### Requirement: Document Validation UI
Users SHALL be able to validate documents via file upload only (no manual checksum entry).

#### Scenario: File Upload Verification
- **WHEN** a user navigates to "Validasi dokumen"
- **AND** uploads a PDF file
- **THEN** the system MUST compute the file hash
- **AND** display the validation result with document details and hash verification info

#### Scenario: No Checksum Tab
- **GIVEN** user is on the validation page
- **THEN** there MUST NOT be a tab for manual checksum entry
- **AND** only file upload dropzone is available

---

### Requirement: Clean PDF Output
Signed documents SHALL NOT have visible verification watermarks.

#### Scenario: Invisible Verification
- **GIVEN** a document has been fully signed
- **WHEN** the PDF is generated
- **THEN** the document MUST NOT contain visible QR codes
- **AND** MUST NOT contain visible "Dokumen Terverifikasi" text
- **AND** verification data MUST be embedded in PDF metadata only

---

### Requirement: Translated UI
All validation page UI elements SHALL be translated.

#### Scenario: Indonesian Translations
- **GIVEN** user has selected Indonesian language
- **WHEN** viewing the validation page with hash verification results
- **THEN** all labels MUST display in Indonesian
- **AND** "Hash Verification", "Server Signature Valid", "Algorithm" must be translated

