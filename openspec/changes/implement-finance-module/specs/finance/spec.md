## ADDED Requirements

### Requirement: Transaction Management
The system MUST allow authorized users to manage financial transactions (Income and Expense).

#### Scenario: Create Income
Given a user with finance permissions
When they submit a new income transaction
Then the system MUST record the amount, date, description, and category
And the transaction type MUST be 'INCOME'

#### Scenario: Create Expense
Given a user with finance permissions
When they submit a new expense transaction
Then the system MUST record the amount, date, description, and category
And the transaction type MUST be 'EXPENSE'

### Requirement: Balance Calculation
The system MUST calculate the current balance as Total Income minus Total Expense.

#### Scenario: View Balance
Given a user with finance permissions
When they view the balance page
Then the system MUST display the total income, total expense, and current balance
And the system MUST display a chart showing trends

### Requirement: Dashboard Integration
The system MUST display key financial metrics on the main dashboard.

#### Scenario: Dashboard Widgets
Given a user with finance permissions
When they view the dashboard
Then the system MUST display widgets for Income, Expense, and Balance

### Requirement: Quick Edit Interface
The system MUST provide a spreadsheet-like interface for rapid bulk editing of financial transactions.

#### Scenario: Bulk Edit
Given a user with finance permissions
When they access the Quick Edit page
Then they MUST be able to edit multiple transaction rows inline
And they MUST be able to save all changes in bulk
