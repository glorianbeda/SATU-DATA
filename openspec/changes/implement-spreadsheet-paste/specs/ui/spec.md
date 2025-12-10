## ADDED Requirements

### Requirement: Spreadsheet Paste
The Quick Edit grid MUST support pasting data from the clipboard, automatically expanding the table if necessary.

#### Scenario: Pasting Multi-row Data
Given the user has copied 3 rows of data from Excel
And the user focuses on the first cell of the last row in Quick Edit
When the user pastes (Ctrl+V)
Then 2 new rows MUST be automatically created
And the data MUST be populated into the corresponding cells

#### Scenario: Column Mapping
Given the user copies a row with "Date", "Type", "Description", "Category", "Amount"
When the user pastes into the "Date" column
Then the data MUST be distributed across the columns in that order

#### Scenario: Partial Paste
Given the user copies 2 columns of data
When the user pastes into the "Description" column
Then only "Description" and "Category" (next column) MUST be updated
And "Date" and "Type" (previous columns) MUST remain unchanged
