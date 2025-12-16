## MODIFIED Requirements

### Requirement: Cookie Management
The system SHALL manage authentication cookies securely and consistently across all routes.

#### Scenario: Setting Auth Cookie
- **GIVEN** a user logs in successfully
- **WHEN** the server sets the `token` cookie
- **THEN** the cookie MUST have `path` set to `/`
- **AND** the cookie MUST be `httpOnly`
- **AND** the cookie MUST be `secure` in production

#### Scenario: Clearing Auth Cookie
- **GIVEN** a user logs out
- **WHEN** the server clears the `token` cookie
- **THEN** the cookie clear command MUST have `path` set to `/`
- **AND** the cookie clear command MUST match the `secure` and `httpOnly` attributes of the set command
