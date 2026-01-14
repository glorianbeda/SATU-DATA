# mobile-responsiveness Spec Delta

## ADDED Requirements

### Requirement: UI MUST NOT Overflow on Small Screens
All UI components MUST render correctly on viewports as narrow as 280px (Galaxy Fold) without horizontal scrollbars.

#### Scenario: Testing a new page on mobile viewport
- Given a new or modified page/component
- When viewed in Chrome DevTools at 375px width (iPhone SE)
- Then no horizontal scrollbar should appear
- And all content is visible without horizontal scrolling

#### Scenario: Testing on extremely narrow viewport
- Given any UI component
- When viewed at 280px width (Galaxy Fold)
- Then content should gracefully wrap or stack
- And remain usable without horizontal overflow

---

### Requirement: Touch Targets MUST Be Accessible
All interactive elements (buttons, links, inputs) MUST have a minimum touch target of 44×44 pixels on mobile.

#### Scenario: Verifying button tap targets
- Given a page with buttons or links
- When inspecting on mobile viewport
- Then each interactive element should have at least 44px height
- And adequate spacing from adjacent elements

---

### Requirement: Text MUST Be Readable on Mobile
Font sizes MUST remain readable on small screens without requiring zoom.

#### Scenario: Checking minimum font size
- Given any page with text content
- When viewed on mobile
- Then body text should be at least 14px
- And headings scale proportionally

---

### Requirement: Dark Mode MUST Work on Mobile
Dark mode styling MUST render correctly on mobile viewports.

#### Scenario: Testing dark mode on mobile
- Given the app in dark mode
- When viewed on a mobile viewport
- Then all elements maintain proper contrast
- And no light-mode colors bleed through
