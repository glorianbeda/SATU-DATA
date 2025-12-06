# UI Spec

## MODIFIED Requirements

### Sidebar Behavior
The sidebar MUST adapt its behavior based on screen size.

#### Scenario: Desktop Sidebar Toggle
Given the user is on a large screen (desktop)
When they click the hamburger menu icon in the header
Then the sidebar toggles between "Expanded" (full width) and "Collapsed" (icon only) states
And the main content area adjusts its left margin accordingly

#### Scenario: Mobile Sidebar Toggle
Given the user is on a small screen (mobile)
When they click the hamburger menu icon
Then the sidebar toggles between "Open" (overlay) and "Closed" (hidden) states

### Mini Sidebar (Collapsed)
When the sidebar is collapsed:
- Only icons are visible.
- Text labels are hidden.
- The width is reduced (e.g., 80px).

#### Scenario: Accessing Submenus in Mini Mode
Given the sidebar is collapsed
When the user hovers or clicks a parent menu item (e.g., "Finance")
Then a floating card/menu appears to the right of the icon
And this card contains the submenu items (e.g., "Income", "Expense")
