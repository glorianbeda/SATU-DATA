# auth-ui Specification

## Purpose
TBD - created by archiving change restore-auth-layout. Update Purpose after archive.
## Requirements
### Requirement: Auth Page Layout
The Auth page (Login/Register) MUST use a split-screen layout on desktop devices.

#### Scenario: Desktop Layout
Given a user accesses the login or register page on a desktop
Then the left side (approx 40%) MUST display the branding image
And the right side (approx 60%) MUST display the authentication form
And the layout MUST take up the full screen height

#### Scenario: Mobile Layout
Given a user accesses the login or register page on a mobile device
Then the branding image MUST be hidden
And the authentication form MUST take up the full width

### Requirement: Unified Form Switching
The system MUST allow switching between Login and Register forms within the right-side panel without changing the overall layout.

#### Scenario: Switching Forms
Given the user is on the Login form
When they switch to Register
Then the Login form slides out of the right panel
And the Register form slides into the right panel
And the left branding panel remains static

