# Serial Number Uniqueness

## ADDED Requirements

### Requirement: Unique Serial Number Validation
The system MUST enforce uniqueness of serial numbers when creating or editing assets.

#### Scenario: Creating asset with unique serial number
Given the user is creating a new asset
When they enter a serial number that doesn't exist in the system
Then the asset should be created successfully

#### Scenario: Creating asset with duplicate serial number
Given the user is creating a new asset
When they enter a serial number that already exists
Then the system should display an error message indicating the serial number is already in use
And the asset should not be created

#### Scenario: Editing asset serial number to unique value
Given the user is editing an existing asset
When they change the serial number to a unique value
Then the asset should be updated successfully

#### Scenario: Editing asset serial number to duplicate value
Given the user is editing an existing asset
When they change the serial number to a value that exists on another asset
Then the system should display an error message
And the asset should not be updated
