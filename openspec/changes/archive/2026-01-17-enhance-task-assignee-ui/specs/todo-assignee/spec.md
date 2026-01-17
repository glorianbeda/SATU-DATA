# todo-assignee Specification Delta

## ADDED Requirements

### Requirement: Assignee Mode Selection

The task edit modal MUST provide option buttons to choose between:
- "Untuk Saya" - Assigns the task to the current user
- "Untuk Orang Lain" - Shows a multi-select picker for other members

#### Scenario: User selects "Untuk Saya"

Given the user opens the task edit modal
When they select "Untuk Saya" option
Then the task is assigned to the current user
And no additional picker is shown

#### Scenario: User selects "Untuk Orang Lain"

Given the user opens the task edit modal
When they select "Untuk Orang Lain" option
Then a searchable multi-select dropdown appears
And users can search for members by name
And users can select multiple assignees

### Requirement: Selected Assignee Display

When assignees are selected, they MUST be displayed as badges (Chips) with a remove button.

#### Scenario: Viewing selected assignees

Given the user has selected multiple assignees
When viewing the assignee field
Then each selected person is shown as a badge/chip
And each badge has an X button to remove the person

#### Scenario: Removing an assignee

Given the user has selected multiple assignees
When they click the X button on a badge
Then that person is removed from the selection
And the badge disappears immediately
