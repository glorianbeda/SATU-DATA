# Finance Import Spec Delta

## ADDED Requirements

### Requirement: Excel/CSV Data Import
Users MUST be able to import income and expense transactions from Excel (.xlsx) or CSV files.

#### Scenario: User imports transactions
- GIVEN a user is on the Income or Expense page
- WHEN the user clicks "Import" and selects a valid Excel file
- THEN the system parses the file and displays a preview or confirmation
- AND upon confirmation, the transactions are added to the database

### Requirement: Column Validation
The system MUST validate that the imported file contains the required columns: Date, Amount, Category, Description.

#### Scenario: Invalid column names
- GIVEN a user uploads a file with missing or mismatched columns (e.g., "Tanggal" instead of "Date")
- THEN the system displays an error message listing the missing required columns
- AND the import is blocked until a valid file is uploaded

### Requirement: Bulk Insert API
The backend MUST provide an endpoint to accept an array of transactions for bulk insertion.

#### Scenario: Bulk insert transactions
- GIVEN a valid array of transaction objects
- WHEN the frontend sends a POST request to `/api/finance/bulk`
- THEN the backend inserts all records in a transaction
- AND returns the count of successfully inserted records
