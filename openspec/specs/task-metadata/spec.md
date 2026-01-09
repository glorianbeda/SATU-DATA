# task-metadata Specification

## Purpose
TBD - created by archiving change enhance-todo-kanban. Update Purpose after archive.
## Requirements
### Requirement: Task Data Model

The Task model SHALL include additional metadata fields.

#### Scenario: Due Date

- **GIVEN** user is creating or editing a task
- **WHEN** user sets a due date
- **THEN** the due date MUST be stored and displayed on the task card

#### Scenario: Completed Timestamp

- **GIVEN** a task is marked as completed
- **WHEN** the status changes to COMPLETED
- **THEN** `completedAt` MUST be automatically set to current timestamp
- **AND** the completion date MUST be visible on the card

#### Scenario: Task Description

- **GIVEN** user is editing a task
- **WHEN** user enters a description
- **THEN** the description MUST be saved (supports multiline text)
- **AND** a preview MUST show on the card (truncated to 2 lines)

#### Scenario: Priority Levels

- **WHEN** user sets task priority
- **THEN** the system MUST accept: LOW, MEDIUM, HIGH
- **AND** priority MUST display as color-coded badge

#### Scenario: Category Tags

- **WHEN** user sets a category
- **THEN** the category MUST be stored as a string
- **AND** displayed as a chip on the task card
- **AND** used for filtering

