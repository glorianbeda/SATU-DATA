# Spec: Task Sharing

## ADDED Requirements

### Requirement: TaskList Management

The system SHALL allow users to create TaskLists to organize and share tasks with team members.

#### Scenario: User creates a new TaskList
- Given user is authenticated
- When user creates TaskList with name "Sprint 1"
- Then TaskList is created with user as owner
- And TaskList appears in user's list selector

#### Scenario: User invites member to TaskList
- Given user owns a TaskList
- When user invites another user with "EDITOR" permission
- Then invited user can see TaskList in their list
- And invited user can create/edit tasks in the list

#### Scenario: Viewer permission restricts editing
- Given user has "VIEWER" permission on TaskList
- When user tries to create or edit a task
- Then operation is denied
- And user can only view tasks

---

### Requirement: Task Assignment

The system SHALL allow tasks to be assigned to specific members of a TaskList.

#### Scenario: Owner assigns task to member
- Given a task exists in a shared TaskList
- When owner assigns task to a member
- Then assignee field is updated
- And task appears in member's "Assigned to me" view

#### Scenario: Assignee completes task
- Given user has task assigned to them
- When user marks task as completed
- Then task status is updated
- And completion is visible to all TaskList members

---

### Requirement: Shared Task Views

The system SHALL provide filtered views for users to see tasks by ownership and assignment.

#### Scenario: User views assigned tasks
- Given user is a member of multiple TaskLists
- When user selects "Assigned to me" filter
- Then only tasks where assigneeId = current user are shown

#### Scenario: User views all tasks in list
- Given user is a member of a TaskList
- When user selects the list
- Then all tasks in that list are shown regardless of assignee
