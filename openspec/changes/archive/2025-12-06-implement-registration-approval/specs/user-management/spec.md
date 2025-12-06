# User Management Specification

## ADDED Requirements

### Requirement: Pending User List
The system SHALL allow Admins to view a list of users awaiting approval.

#### Scenario: View Pending Users
- **GIVEN** an Admin user
- **WHEN** they access the User Management page
- **THEN** they MUST see a list of users with status "PENDING"

### Requirement: Approve User
The system SHALL allow Admins to approve pending users.

#### Scenario: Approve User
- **GIVEN** an Admin viewing a pending user
- **WHEN** they click "Approve"
- **THEN** the user's status MUST update to "APPROVED"
- **AND** a verification email MUST be sent to the user
- **AND** a verification token MUST be generated

### Requirement: Reject User
The system SHALL allow Admins to reject pending users.

#### Scenario: Reject User
- **GIVEN** an Admin viewing a pending user
- **WHEN** they click "Reject"
- **THEN** the user's status MUST update to "REJECTED"
- **AND** the user MUST NOT be able to login
