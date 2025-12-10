## ADDED Requirements

### Requirement: Premium Modal UI
The transaction modal MUST have a premium, modern design.

#### Scenario: Income Modal Visuals
Given a user opens the "Add Income" modal
Then the modal header MUST have a green-themed gradient background
And the modal MUST display a "Trending Up" icon
And the file upload area MUST be visually distinct (e.g., dashed border box)

#### Scenario: Expense Modal Visuals
Given a user opens the "Add Expense" modal
Then the modal header MUST have a red-themed gradient background
And the modal MUST display a "Trending Down" icon
And the file upload area MUST be visually distinct

### Requirement: Responsive & Themed
The modal MUST be responsive and support dark mode.

#### Scenario: Dark Mode
Given the application is in dark mode
When the modal is open
Then the background and text colors MUST adapt to dark theme standards (e.g., dark gray background, light text)

### Requirement: Enhanced Quick Edit
The Quick Edit interface MUST resemble a spreadsheet.

#### Scenario: Spreadsheet Layout
Given a user accesses the Quick Edit page
Then the data MUST be presented in a compact grid
And the user MUST be able to add a new row directly from the grid
And the inputs MUST be styled minimally to look like cells
