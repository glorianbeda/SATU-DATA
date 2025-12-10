# Sidebar Responsive Spec Delta

## ADDED Requirements

### Requirement: Mobile Sidebar Height
The sidebar MUST occupy the full height of the screen on mobile devices, even when content is short or scrolling occurs.

#### Scenario: Sidebar on tall mobile screen
- GIVEN a user opens the sidebar on a mobile device
- WHEN the screen height is large
- THEN the sidebar background extends to the bottom of the viewport
- AND no whitespace is visible below the sidebar content
