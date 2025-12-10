# mobile-header Specification

## Purpose
TBD - created by archiving change improve-mobile-ux. Update Purpose after archive.
## Requirements
### Requirement: Responsive Header Toggles
The Language Selector and Theme Toggle MUST be hidden from the main header bar on mobile devices (viewport width < 768px) and visible on desktop.

#### Scenario: Viewing header on mobile
- GIVEN a user is on a mobile device
- WHEN they view the header
- THEN the Language and Theme icons are NOT visible in the top bar
- AND the Profile Picture IS visible

### Requirement: Profile Menu Toggles
The Profile Dropdown Menu MUST include options to change Language and Theme ONLY on mobile devices.

#### Scenario: Changing theme on mobile
- GIVEN a user is on a mobile device
- WHEN they click their Profile Picture
- THEN the dropdown menu appears
- AND it contains "Change Language" and "Toggle Theme" options
- WHEN they click "Toggle Theme"
- THEN the application theme switches (Light/Dark)

