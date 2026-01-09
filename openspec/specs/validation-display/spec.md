# validation-display Specification

## Purpose
TBD - created by archiving change improve-omk-docs. Update Purpose after archive.
## Requirements
### Requirement: Document Validation Indicator

Signed documents MUST have a validation indicator that is less intrusive than current large QR code.

#### Scenario: Signed document has validation

- GIVEN a document has been signed
- WHEN PDF is generated
- THEN validation indicator appears in document footer
- AND indicator is either:
  - Small QR code (max 1cm x 1cm)
  - OR text-only verification code with URL
- AND verification URL remains functional

