# todo-list Specification

## Purpose
TBD - created by archiving change add-productivity-tools. Update Purpose after archive.
## Requirements
### Requirement: Task Management

Users SHALL be able to create, view, update, and delete personal tasks.

#### Scenario: Create Task

- **GIVEN** user is logged in
- **WHEN** user clicks "Add Task" and enters title
- **THEN** a new task MUST be created with status "PENDING"

#### Scenario: Drag to Complete

- **GIVEN** user has pending tasks
- **WHEN** user drags a task to the "Completed" column
- **THEN** the task status MUST update to "COMPLETED"
- **AND** a smooth animation MUST play during the transition

#### Scenario: Drag to Pending

- **GIVEN** user has completed tasks
- **WHEN** user drags a task back to the "Pending" column
- **THEN** the task status MUST update to "PENDING"

---

### Requirement: Interactive Drag-and-Drop

The To-Do List SHALL support drag-and-drop between columns with visual feedback.

#### Scenario: Visual Feedback

- **WHEN** user starts dragging a task
- **THEN** the task MUST show a lifted/shadow effect
- **AND** the drop target MUST highlight

#### Scenario: Reorder Tasks

- **WHEN** user drags a task within the same column
- **THEN** the task order MUST update accordingly

