# navigation-performance Specification

## Purpose
TBD - created by archiving change optimize-navigation-performance. Update Purpose after archive.
## Requirements
### Requirement: Layout components must be memoized

Layout components (`Sidebar`, `Header`) MUST be wrapped with `React.memo` to prevent unnecessary re-renders during page navigation.

#### Scenario: Navigation does not re-render Sidebar

**Given** user is on Dashboard page  
**When** user navigates to Income page  
**Then** Sidebar component should NOT re-render (same props = same output)

#### Scenario: Navigation does not re-render Header

**Given** user is on any authenticated page  
**When** user navigates to another page  
**Then** Header component should NOT re-render unless title changes

---

### Requirement: Profile data must be fetched only once per session

`MainLayout` MUST fetch user profile only when entering protected routes, not on every path change.

#### Scenario: Profile fetch on initial load

**Given** user is not authenticated  
**When** user logs in and enters Dashboard  
**Then** profile should be fetched exactly once

#### Scenario: No profile re-fetch on navigation

**Given** user is authenticated and on Dashboard  
**When** user navigates to Income, then Expense, then back to Dashboard  
**Then** profile API should NOT be called again

---

### Requirement: Menu items must be memoized

Static menu item arrays MUST be wrapped with `useMemo` to prevent recreation on every render.

#### Scenario: Menu items stability

**Given** Sidebar component is rendered  
**When** parent component re-renders  
**Then** menuItems array reference should remain stable (same object reference)

---

