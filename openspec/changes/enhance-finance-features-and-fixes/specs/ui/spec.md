## ADDED Requirements

### Requirement: Spreadsheet-like Quick Edit
The Quick Edit feature MUST provide a spreadsheet-like user experience.

#### Scenario: Grid Navigation
Given a user is on the Quick Edit page
When the user presses Arrow keys
Then the focus MUST move to the adjacent cell in the direction of the key

#### Scenario: Seamless Editing
Given a user is editing a cell
Then the input MUST fill the entire cell without visible borders
And the user MUST be able to type immediately

### Requirement: Complete Data Export
The DataTable export (PDF/CSV) MUST include all visible data columns.

#### Scenario: Export with Rendered Cells
Given a table has columns with custom rendering (e.g., formatted Amount)
When the user exports to CSV or PDF
Then the exported file MUST contain the formatted values (or raw values) for those columns
And NO columns should be missing

#### Scenario: PDF Export Functionality
Given the user clicks "Export as PDF"
Then a PDF file MUST be generated and downloaded
And the PDF MUST contain the table data
