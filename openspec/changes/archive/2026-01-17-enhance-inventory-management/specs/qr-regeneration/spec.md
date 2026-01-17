# QR Code Regeneration

## ADDED Requirements

### Requirement: QR Code Regeneration

The system MUST allow users to regenerate QR codes for assets with confirmation.

#### Scenario: User initiates QR code regeneration

Given the user is viewing an asset detail page
When they click the "Regenerate QR" button
Then a confirmation dialog should appear asking for confirmation

#### Scenario: User confirms QR code regeneration

Given the confirmation dialog is displayed
When the user confirms the regeneration
Then the system should generate a new QR code for the asset
And display a success message upon completion
And update the asset's QR code in the database

#### Scenario: QR code regeneration fails

Given the user confirms QR code regeneration
When the regeneration process fails
Then the system should display an error message
And the original QR code should remain unchanged

#### Scenario: User cancels QR code regeneration

Given the confirmation dialog is displayed
When the user cancels the action
Then the dialog should close
And no changes should be made to the asset
