# omk-docs Specification

## MODIFIED Requirements

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
