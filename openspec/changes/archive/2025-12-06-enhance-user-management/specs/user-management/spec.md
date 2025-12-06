# User Management Specification

## MODIFIED Requirements

### Requirement: View All Users

The admin SHALL be able to view all registered users.

#### Scenario: List All Users

- **GIVEN** an admin user on the User Management page
- **WHEN** clicking the "All Users" tab
- **THEN** a DataTable MUST display all users with columns: Name, Email, Role, Status, Actions
- **AND** pagination and search MUST be available

### Requirement: Change User Role

The admin SHALL be able to change a user's role.

#### Scenario: Update User Role

- **GIVEN** an admin viewing the All Users list
- **WHEN** selecting a new role from the dropdown for a user
- **THEN** the user's role MUST be updated in the database
- **AND** a success message MUST be shown

### Requirement: Resend Verification Email

The admin SHALL be able to resend verification emails.

#### Scenario: Resend Verification

- **GIVEN** a user with APPROVED status
- **WHEN** the admin clicks "Resend Verification"
- **THEN** a new verification email MUST be sent
- **AND** the rate limiter MUST prevent spam

### Requirement: Edit User

The admin SHALL be able to edit user details.

#### Scenario: Update User Details

- **GIVEN** an admin clicking "Edit" on a user row
- **WHEN** modifying name or email and saving
- **THEN** the user details MUST be updated
- **AND** a success message MUST be shown

### Requirement: Delete User

The admin SHALL be able to delete/deactivate users.

#### Scenario: Delete User

- **GIVEN** an admin clicking "Delete" on a user row
- **WHEN** confirming the deletion
- **THEN** the user MUST be removed or deactivated
- **AND** a success message MUST be shown
