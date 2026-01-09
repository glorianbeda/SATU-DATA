# Capability: Form Submission

## ADDED Requirements

### Requirement: System handles public form access
Public users (guests) and authenticated users SHALL be able to access and view form content via a public slug.
#### Scenario: Guest views valid form
-   Given a form with slug "event-reg" is active
-   When a guest visits "/f/event-reg"
-   Then they see the form fields rendered
-   And they see a "Name" input field (since they are guests)

#### Scenario: Authenticated user views valid form
-   Given a logged-in user visits "/f/event-reg"
-   Then they see the form fields rendered
-   And the "Name" input is hidden or pre-filled with their session name

### Requirement: System enforces submission limits
The system SHALL enforce configuration limits such as one response per user account or device.
#### Scenario: Limit one response per user
-   Given a form has "limitOneResponsePerUser" set to true
-   And the user has already submitted a response
-   When they try to submit again
-   Then the system rejects the submission with an error message

#### Scenario: New response submission
-   Given a valid form and valid input data
-   When the user submits the form
-   Then the data is saved to the database
-   And a success message is displayed
