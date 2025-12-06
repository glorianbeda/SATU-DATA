# omk-docs Specification

## ADDED Requirements

### Requirement: Inbox Status Display
The system SHALL correctly display the status of signature requests in the Inbox.

#### Scenario: Signed Request
- **GIVEN** a signature request with status "SIGNED" or isSigned=true
- **WHEN** the user views the Inbox
- **THEN** the status chip MUST display "Signed"
