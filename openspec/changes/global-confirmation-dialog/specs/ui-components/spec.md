# UI Components Spec Delta

## ADDED Requirements

### Requirement: Global Confirmation Dialog
The system SHALL provide a global mechanism to request user confirmation via a modal dialog.

#### Scenario: User triggers a destructive action
- **Given** a user initiates a destructive action (e.g., Reject)
- **When** the application requests confirmation
- **Then** a modal dialog appears with a title, description, and Confirm/Cancel buttons
- **And** the application waits for the user's choice
- **When** the user clicks "Confirm"
- **Then** the action proceeds
- **When** the user clicks "Cancel"
- **Then** the action is aborted
