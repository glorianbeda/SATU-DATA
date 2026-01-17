# Reusable Table Filters

## ADDED Requirements

### Requirement: Column Dropdown Filters
Tables MUST support configurable dropdown filters for columns.

#### Scenario: Filter by category dropdown
Given a table with category column
When the user selects a category from the filter dropdown
Then only rows matching that category should be displayed

#### Scenario: Clear dropdown filter
Given a filter is applied
When the user clears the filter selection
Then all rows should be displayed

### Requirement: Date Range Filter
Tables MUST support date range filtering for date columns.

#### Scenario: Filter by date range
Given a table with date columns
When the user selects a start date and end date
Then only rows with dates within that range should be displayed

#### Scenario: Filter with only start date
Given a table with date columns
When the user selects only a start date
Then only rows with dates on or after that date should be displayed

#### Scenario: Filter with only end date
Given a table with date columns
When the user selects only an end date
Then only rows with dates on or before that date should be displayed

### Requirement: Filter State Persistence
Active filters MUST be visible and manageable.

#### Scenario: Display active filters
Given filters are applied
When the user views the table
Then active filters should be displayed as chips or indicators
And the user should be able to remove individual filters
