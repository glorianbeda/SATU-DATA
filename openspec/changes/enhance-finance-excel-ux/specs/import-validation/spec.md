# Import Validation Specification

## MODIFIED Requirements
### Requirement: Row-Level Validation
The import preview MUST validate each row against schema requirements.

#### Scenario: Invalid Data Detection
- GIVEN an uploaded Excel file contains a row with "Amount" = "abc" (text)
- WHEN the file is parsed
- THEN that cell is marked as invalid in the preview
- AND the row is flagged as having errors

### Requirement: Error Highlighting
The UI MUST visually indicate specific errors in the preview table.

#### Scenario: Displaying Errors
- GIVEN the preview table is shown
- WHEN a cell has an error
- THEN the cell background is red/pink
- AND hovering over the cell shows a tooltip with the error message
