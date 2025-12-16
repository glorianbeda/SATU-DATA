# ui-components Spec Delta

## ADDED Requirements

### Requirement: Quick Edit Toast Alerts
The Quick Edit page SHALL use global MUI Toast alerts for user feedback.

#### Scenario: Empty Row Validation Warning
- **GIVEN** a Quick Edit page with one or more rows missing required data (description or amount)
- **WHEN** the user clicks "Save Changes"
- **THEN** a warning toast MUST appear indicating rows with incomplete data
- **AND** the save operation MUST NOT proceed

#### Scenario: Save Error Notification
- **GIVEN** a Quick Edit page with modified transactions
- **WHEN** the save operation fails due to network or server error
- **THEN** an error toast MUST appear with the error message

#### Scenario: Save Success Notification
- **GIVEN** a Quick Edit page with modified transactions
- **WHEN** the save operation completes successfully
- **THEN** a success toast MUST appear confirming changes were saved

#### Scenario: Delete Row Feedback
- **GIVEN** a Quick Edit page with existing transactions
- **WHEN** the user deletes a row
- **THEN** a success toast SHOULD appear confirming deletion
- **OR** an error toast MUST appear if deletion fails
