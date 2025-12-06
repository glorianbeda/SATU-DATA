# UI Spec

## MODIFIED Requirements

### Global Scrollbar
The application MUST use a custom scrollbar style.

#### Scenario: User scrolls a page
Given the user is viewing a long page
When they scroll
Then they see a thin, rounded scrollbar thumb
And the scrollbar track is transparent or subtle
And the scrollbar colors adapt to the current theme (light/dark)
