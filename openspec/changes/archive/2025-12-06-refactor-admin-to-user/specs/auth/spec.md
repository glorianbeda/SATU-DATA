## ADDED Requirements

### Requirement: User Entity
The system SHALL store user accounts in a `User` table, distinct from specific roles.
**Reason**: To support multiple roles (Super Admin, Admin, Member) within a unified user management system.

#### Scenario: User Schema Definition
- **WHEN** the database schema is inspected
- **THEN** a `User` table MUST exist
- **AND** it MUST contain `email`, `password`, `name`, `roleId`
- **AND** it MUST NOT be named `Admin`

### Requirement: Role-Based Access
Users SHALL be assigned a role from the `Role` table.

#### Scenario: Role Assignment
- **WHEN** a user is created
- **THEN** they MUST be linked to a valid `Role`
