# Design: Implement SPA Navigation

## Context
The current React frontend uses `react-router-dom` but occasionally falls back to `window.location.href` for programmatic navigation (like redirects after login or clicking dashboard stat cards). This triggers a full browser reload, breaking the SPA experience.

## Technical Approach
We will standardise programmatic navigation using the `useNavigate` hook and replace direct `<a>` style behavior with `<Link>` components or `navigate()` calls.

### 1. Programmatic Navigation (useNavigate)
For redirects and button clicks that triggers navigation, we will use the `useNavigate` hook.

**Targeted Files:**
- `src/features/auth/components/LoginForm.jsx`: Use `navigate(redirectUrl || '/dashboard')` instead of `window.location.href`.
- `src/pages/inventory/index.jsx`: Replace `window.location.href` in `StatCard` click handlers.
- `src/pages/inventory/loans/index.jsx`: Replace `window.location.href` in action buttons (e.g., view details).
- `src/pages/inventory/loans/my-loans.jsx`: Replace `window.location.href` in action buttons.
- `src/components/Header.jsx`: Use `navigate('/login')` after logout instead of manual refresh if needed (though `navigate` is already used in some places).

### 2. Guarding State
By moving to `useNavigate`, the application state (MUI Theme, Sidebar collapse state, Auth context) will persist across "page changes" because the React component tree is not unmounted and remounted by the browser.

### 3. Maintaining Declarative Routing
The existing `App.jsx` structure using `useRoutes(routes)` from `react-router-dom` will be kept intact. No changes to the routing configuration logic are required, only to the *triggers* of navigation.

## Risks / Trade-offs
- **URL Parameters**: Ensure that `navigate` correctly handles query strings that were previously handled by direct URL assignment.
- **Side Effects**: Some components might rely on a full refresh to "clean up" memory or state. We need to verify that components behave correctly when transitioned within the same session.
