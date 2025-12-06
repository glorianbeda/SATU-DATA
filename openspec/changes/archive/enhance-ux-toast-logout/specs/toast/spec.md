# Toast Notification Spec

## MODIFIED Requirements

### Global Availability
The toast system MUST be available globally via a hook.

#### Scenario: Show Success Toast
Given the user performs a successful action
When the action completes
Then a green success toast appears at the top-right

#### Scenario: Show Error Toast
Given the user performs an action that fails
When the action fails
Then a red error toast appears at the top-right
