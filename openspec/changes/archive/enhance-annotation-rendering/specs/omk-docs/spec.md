# OMK Docs Spec Delta

## MODIFIED Requirements

### Requirement: Document Signing
The system SHALL support placing various annotation types on the document.

#### Scenario: User places a text annotation
- **Given** a user adds a text annotation "Approved"
- **When** the document is signed
- **Then** the text "Approved" appears on the final PDF at the specified location

#### Scenario: User resizes a signature
- **Given** a user resizes the signature box to be larger
- **When** the document is signed
- **Then** the signature image on the PDF matches the size specified by the user
