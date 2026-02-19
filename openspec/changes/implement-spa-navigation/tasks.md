# Task List: Implement SPA Navigation

## Phase 1: Authentication Navigation
- [x] 1.1 Update `src/features/auth/components/LoginForm.jsx` to use `useNavigate` for post-login redirect.
- [x] 1.2 Update `src/components/Header.jsx` logout handler to use standard navigation if any manual refresh exists. (Verified: Already using navigate)

## Phase 2: Inventory Navigation
- [x] 2.1 Update `src/pages/inventory/index.jsx` (Dashboard) to use `navigate` for stat card clicks.
- [x] 2.2 Update `src/pages/inventory/loans/index.jsx` to use `navigate` for viewing loan details.
- [x] 2.3 Update `src/pages/inventory/loans/my-loans.jsx` to use `navigate` for viewing loan details.

## Phase 3: Verification
- [x] 3.1 Verify navigation between pages does not trigger a full browser reload (no flicker).
- [x] 3.2 Verify that Sidebar state (collapsed/expanded) persists across navigations.
- [x] 3.3 Verify that Theme mode (dark/light) persists across navigations.
