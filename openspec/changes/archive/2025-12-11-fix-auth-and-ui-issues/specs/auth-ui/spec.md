## ADDED Requirements

### Requirement: Logout Confirmation
The system SHALL require confirmation before logging a user out to prevent accidental logouts.

#### Scenario: User clicks logout
- **GIVEN** the user is logged in
- **AND** the user opens the sidebar (mobile or desktop)
- **WHEN** the user clicks the "Logout" button
- **THEN** a confirmation modal MUST appear asking "Are you sure you want to logout?"
- **AND** the modal MUST have "Cancel" and "Logout" buttons

#### Scenario: User confirms logout
- **GIVEN** the logout confirmation modal is open
- **WHEN** the user clicks "Logout"
- **THEN** the logout API MUST be called
- **AND** the user MUST be redirected to the login page

## MODIFIED Requirements

### Requirement: Login Page Styling
The login page SHALL be visually consistent with the system's theme and layout standards.

#### Scenario: Dark Mode Background
- **GIVEN** the user is on the login page
- **AND** the system/app is in dark mode
- **THEN** the background of the login form container MUST be dark (e.g., `bg-gray-900`)
- **AND** the text MUST be readable (light color)

#### Scenario: Login Form Alignment
- **GIVEN** the user is on the login page
- **WHEN** the login form is displayed
- **THEN** the input fields (Email, Password) MUST be centered horizontally relative to the form container
- **AND** the input fields MUST take up the appropriate width (e.g., full width of the form container)
