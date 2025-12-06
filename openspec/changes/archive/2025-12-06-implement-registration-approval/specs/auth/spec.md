# Auth Specification

## ADDED Requirements

### Requirement: User Registration
The system SHALL allow visitors to register for an account.

#### Scenario: Successful Registration
- **GIVEN** a visitor on the registration page
- **WHEN** they submit valid name, email, and password
- **THEN** a new user account is created with status "PENDING"
- **AND** the user is informed that their account is awaiting approval

### Requirement: Login Approval Check
The system SHALL prevent users with "PENDING" or "REJECTED" status from logging in.

#### Scenario: Pending User Login
- **GIVEN** a user with status "PENDING"
- **WHEN** they attempt to login with correct credentials
- **THEN** the system MUST deny access
- **AND** return an error message "Account is pending approval"

### Requirement: Email Verification
The system SHALL require users to verify their email after approval.

#### Scenario: Verify Email
- **GIVEN** a user with status "APPROVED" and a valid verification token
- **WHEN** they access the verification link
- **THEN** their status MUST update to "VERIFIED"
- **AND** they MUST be able to login
