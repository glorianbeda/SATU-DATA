# UI Spec

## MODIFIED Requirements

### Header Profile Menu
The header MUST display the user's profile information and provide access to account actions.

#### Scenario: Viewing Profile in Header
Given the user is logged in
When they look at the header (top right)
Then they see their avatar (and optionally name)
And they do NOT see the profile section in the sidebar

#### Scenario: Accessing Profile Actions
Given the user clicks on their profile in the header
Then a dropdown menu appears
And the menu contains "Edit Profile" and "Logout" options

#### Scenario: Logging Out
Given the profile menu is open
When the user clicks "Logout"
Then they are logged out and redirected to the login page
