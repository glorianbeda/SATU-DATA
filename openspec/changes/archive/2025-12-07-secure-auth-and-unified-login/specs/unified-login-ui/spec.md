## ADDED Requirements

### Requirement: Unified Auth Interface
The system MUST present Login and Register forms on a single route, allowing users to switch between them without a full page reload.

#### Scenario: Switch to Register
Given a user is on the Login view
When they click "Register here"
Then the Login form slides out
And the Register form slides in
And the URL may remain the same or update query param (optional)

#### Scenario: Switch to Login
Given a user is on the Register view
When they click "Sign in here"
Then the Register form slides out
And the Login form slides in
