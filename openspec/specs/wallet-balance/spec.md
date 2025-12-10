# wallet-balance Specification

## Purpose
TBD - created by archiving change enhance-ux-loading-and-wallet. Update Purpose after archive.
## Requirements
### Requirement: Wallet UI Display
The balance page MUST display a premium wallet-style card showing the user's balance.

#### Scenario: User views balance page
- GIVEN a user navigates to `/finance/balance`
- THEN a wallet card is displayed with:
  - Initial balance (editable)
  - Balance effective date
  - Total income (after effective date)
  - Total expense (after effective date)
  - Calculated current balance

### Requirement: Date-Based Balance Calculation
The balance MUST be calculated using only transactions after the balance effective date.

#### Scenario: Balance calculation with date filter
- GIVEN an initial balance of 1,000,000 set on December 1, 2025
- AND income of 500,000 on December 5, 2025
- AND expense of 200,000 on December 10, 2025
- AND income of 100,000 on November 15, 2025 (before effective date)
- THEN the current balance is 1,300,000 (ignoring November income)

### Requirement: Edit Initial Balance with Date
Users MUST be able to modify their initial balance and its effective date.

#### Scenario: User updates initial balance
- GIVEN a user is on the balance page
- WHEN the user clicks the edit button
- THEN a modal appears with:
  - Input field for balance amount
  - Date picker for effective date
- AND when the user saves, the balance and date are updated via API

### Requirement: Balance Audit Log
The system MUST record all changes to the initial balance.

#### Scenario: Audit log creation
- GIVEN a user updates the initial balance
- THEN an audit log entry is created with:
  - Old balance and date
  - New balance and date
  - User who made the change
  - Timestamp of change

#### Scenario: View audit log
- GIVEN a user clicks the history button on the wallet card
- THEN a modal displays all previous balance changes

### Requirement: Balance API Endpoints
The backend MUST provide endpoints for managing initial balance.

#### Scenario: Get initial balance
- GIVEN a user requests `GET /api/finance/initial-balance`
- THEN the API returns the current initial balance, effective date, and calculated totals

#### Scenario: Update initial balance
- GIVEN a user sends `PUT /api/finance/initial-balance` with amount and date
- THEN the API updates the balance and date
- AND creates an audit log entry
- AND returns the updated data

#### Scenario: Get balance history
- GIVEN a user requests `GET /api/finance/balance-history`
- THEN the API returns a list of all balance audit log entries

