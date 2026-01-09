# notebook-ui Specification

## Purpose
TBD - created by archiving change redesign-notebook-ui. Update Purpose after archive.
## Requirements
### Requirement: Editing Notes
The editing interface SHALL use a modal/dialog instead of a split-pane view.

#### Scenario: Opening Editor
Given I see a note card
When I click on the card body
Then a Modal/Dialog opens with the full note content
And I can edit the Title and Content
And I can change the Color or Pin status
And clicking outside saves and closes the modal

