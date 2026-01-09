# Capability: Form Management

## ADDED Requirements

### Requirement: User can manage forms
The user SHALL be able to create, edit, and delete forms and view their responses.
#### Scenario: User creates a new form
-   Given an authenticated user is on the dashboard
-   When they click "Create Form"
-   Then they are navigated to the form builder
-   And a new form is created with default status "Active"

#### Scenario: User adds fields to form
-   Given the user is in the form builder
-   When they drag a "Text Field" to the canvas
-   Then the field is added to the form schema
-   And they can configure the field label and required status

#### Scenario: User deletes a form
-   Given the user sees a form in the dashboard list
-   When they click "Delete" and confirm
-   Then the form is soft-deleted
-   And it no longer appears in the list

#### Scenario: User views responses
-   Given the user is on the dashboard
-   When they click "View Responses" on a form card
-   Then they see a table with columns matching the form fields
-   And the table is populated with submission data
