# kanban-ui Spec Delta

## ADDED Requirements

### Requirement: Draggable Task Cards

The entire task card SHALL be draggable, not just a drag handle icon.

#### Scenario: Drag Full Card

- **GIVEN** user is viewing the Kanban board
- **WHEN** user clicks and holds anywhere on a task card
- **THEN** the card MUST lift with shadow effect
- **AND** the card MUST follow the cursor during drag
- **AND** drop targets MUST highlight

---

### Requirement: Enhanced Card Design

Task cards SHALL display comprehensive task information.

#### Scenario: Card Layout

- **GIVEN** a task with title, description, due date, priority, and category
- **WHEN** the card is rendered
- **THEN** the card MUST show:
  - Title (bold, max 2 lines)
  - Description preview (max 2 lines, truncated)
  - Due date with calendar icon
  - Priority badge (color-coded)
  - Category chip

#### Scenario: Overdue Indicator

- **GIVEN** a task with due date in the past
- **WHEN** the task is not completed
- **THEN** the due date MUST display in red
- **AND** an overdue indicator MUST be visible

---

### Requirement: Three-Column Layout

The Kanban board SHALL have three default columns.

#### Scenario: Default Columns

- **WHEN** user opens the To-Do List
- **THEN** three columns MUST be displayed:
  - "Pending" (status: PENDING)
  - "In Progress" (status: IN_PROGRESS)
  - "Completed" (status: COMPLETED)

---

### Requirement: Filter and Sort

Users SHALL be able to filter and sort tasks.

#### Scenario: Filter by Priority

- **GIVEN** tasks with different priorities exist
- **WHEN** user selects "High" priority filter
- **THEN** only high priority tasks MUST be displayed

#### Scenario: Sort by Due Date

- **WHEN** user selects "Due Soon" sort option
- **THEN** tasks MUST be ordered by due date ascending (soonest first)

#### Scenario: Search Tasks

- **WHEN** user types in search bar
- **THEN** only tasks matching title or description MUST be displayed
