# Proposal: Implement SPA Navigation

## Why
The application is intended to be a Single Page Application (SPA) using React and `react-router-dom`. However, several core components and pages still utilize `window.location.href` for navigation. This triggers a full browser refresh, which:
- Breaks the seamless SPA experience (page flicker).
- Resets the internal React state.
- Increases load times for each transition.
- Makes the application feel like a legacy multi-page website rather than a modern web app.

## What Changes
We will transition the application to a true SPA navigation model. This involves:
1. Replacing all instances of `window.location.href` with React Router's `navigate()` function.
2. Replacing any legacy `<a>` tags or manual window navigation in buttons with the `<Link>` component or `onNavigate` handlers.
3. Ensuring the declarative routing structure (using `useRoutes` in `App.jsx`) is maintained and clear for other developers.

## Capabilities
- `spa-navigation-core`: Implementation of standard SPA navigation patterns across the application.

## Impact
- **Navigation components**: `Sidebar.jsx` and `Header.jsx` updates to use consistent SPA links.
- **Feature components**: `LoginForm.jsx` and `Inventory` pages where `window.location.href` was used for redirects.
- **Global State**: Navigation will no longer clear the React Context or local states (like Sidebar collapse state).
