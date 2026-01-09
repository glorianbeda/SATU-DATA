# Notebook UI Redesign

## ADDED Requirements

### Requirement: Masonry Grid Layout
The system SHALL display notes in a multi-column grid layout that adapts to screen size, maximizing screen real estate. The layout MUST adapt to single column on mobile.

#### Scenario: Viewing notes on desktop
Given I am on the Notebook page on a large screen
When the page loads
Then I see notes arranged in 3 or 4 columns
And notes are ordered chronologically (approx left-to-right, top-to-bottom)
And cards have variable heights based on content

#### Scenario: Viewing notes on mobile
Given I am on the Notebook page on a mobile device
When the page loads
Then I see notes arranged in a single vertical column (stack)
And the cards take up full width (minus padding)

### Requirement: Note Visuals
The system SHALL support visual distinctions (colors, pinned status) for notes.

#### Scenario: Note Colors
Given I am editing a note
When I select a color from the palette
Then the note card background changes to that color
And the text contrast adjusts automatically (or stays readable)

#### Scenario: Pinned Notes
Given I have filtered/sorted views
When I pin a note
Then it appears in a dedicated "Pinned" section at the top of the grid
And it remains visible even when scrolling down the "Others" section (if sticky) or just stays at top

### Requirement: Mobile Navigation
The system SHALL provide a bottom navigation bar for mobile users to access primary actions.

#### Scenario: Using Bottom Bar
Given I am on mobile view
Then I see a fixed bar at the bottom of the screen
And it contains a large "Add" button
And it contains iconic links for "Search" or "Menu"

## ADDED Requirements

### Requirement: Editing Notes
The editing interface SHALL use a modal/dialog instead of a split-pane view.

#### Scenario: Opening Editor
Given I see a note card
When I click on the card body
Then a Modal/Dialog opens with the full note content
And I can edit the Title and Content
And I can change the Color or Pin status
And clicking outside saves and closes the modal
