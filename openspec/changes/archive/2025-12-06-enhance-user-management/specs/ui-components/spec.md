# UI Components Specification

## MODIFIED Requirements

### Requirement: Global Alert System

The system SHALL provide a global alert/toast notification system.

#### Scenario: Show Success Alert

- **GIVEN** any component using the `useAlert` hook
- **WHEN** calling `showSuccess("Message")`
- **THEN** a green success snackbar MUST appear at the top-right
- **AND** it MUST auto-dismiss after 4 seconds

#### Scenario: Show Error Alert

- **GIVEN** any component using the `useAlert` hook
- **WHEN** calling `showError("Error message")`
- **THEN** a red error snackbar MUST appear at the top-right
- **AND** it MUST have a close button

#### Scenario: Show Warning Alert

- **GIVEN** any component using the `useAlert` hook
- **WHEN** calling `showWarning("Warning message")`
- **THEN** an orange warning snackbar MUST appear at the top-right

#### Scenario: Show Info Alert

- **GIVEN** any component using the `useAlert` hook
- **WHEN** calling `showInfo("Info message")`
- **THEN** a blue info snackbar MUST appear at the top-right
