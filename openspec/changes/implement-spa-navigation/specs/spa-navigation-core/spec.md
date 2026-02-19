# Capability: spa-navigation-core

Implementation of standard SPA navigation patterns across the application to prevent full page refreshes.

## Requirements

### Requirement: Prevent Full Page Refresh on Navigation
- **GIVEN** a user is on any page of the portal
- **WHEN** they click a navigation item in the Sidebar, Header, or any internal link
- **THEN** the URL should update and the component should change without the browser performing a full refresh (flicker)

### Requirement: Preserve React State During Navigation
- **GIVEN** a local or global React state is active (e.g., Sidebar is collapsed)
- **WHEN** the user navigates between different routes
- **THEN** the React state must be preserved and not reset (unless explicitly intended by logic)

### Requirement: Declarative Routing Consistency
- **GIVEN** the use of `react-router-dom` `useRoutes` hook in `App.jsx`
- **WHEN** adding or modifying routes for SPA navigation
- **THEN** they must remain centralized/declarative to ensure maintainability for other developers

### Requirement: Redirect Success Handling
- **GIVEN** a programmatic redirect (e.g., after successful login or document submission)
- **WHEN** the redirect occurs
- **THEN** it must use `useNavigate` instead of `window.location.href` to maintain the SPA session
