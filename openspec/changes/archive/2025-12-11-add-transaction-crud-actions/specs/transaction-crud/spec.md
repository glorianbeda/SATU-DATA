# Transaction CRUD Actions Spec

## ADDED Requirements

### Requirement: DataTable row-level edit action
The system MUST allow users to edit individual transactions directly from the Income or Expense table by clicking an edit action button.

#### Scenario: User edits a transaction from Income table
- **Given** the user is on the Income page
- **When** the user clicks the edit button on a transaction row
- **Then** a modal opens pre-filled with the transaction data
- **And** the user can modify and save the changes

#### Scenario: User edits a transaction from Expense table
- **Given** the user is on the Expense page
- **When** the user clicks the edit button on a transaction row
- **Then** a modal opens pre-filled with the transaction data
- **And** the user can modify and save the changes

---

### Requirement: DataTable row-level delete action
The system MUST allow users to delete individual transactions from the Income or Expense table with confirmation.

#### Scenario: User deletes a transaction with confirmation
- **Given** the user is on the Income or Expense page
- **When** the user clicks the delete button on a transaction row
- **Then** a confirmation dialog appears
- **And** upon confirmation, the transaction is deleted from the database
- **And** the table refreshes to show updated data

#### Scenario: User cancels delete action
- **Given** the user clicks the delete button
- **When** the confirmation dialog appears
- **And** the user clicks cancel
- **Then** the transaction is not deleted

---

### Requirement: Mobile card view actions
The system MUST display edit and delete actions in the mobile card view layout.

#### Scenario: User sees actions in mobile card view
- **Given** the user is viewing the table on a mobile device
- **Then** each transaction card displays edit and delete action buttons
