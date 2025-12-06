# Global Confirmation Dialog

## Problem
The application currently uses native browser `window.confirm()` and `alert()` for critical user interactions (e.g., rejecting a document). This breaks the UI consistency, looks unprofessional, and cannot be styled to match the application's theme.

## Solution
Implement a global **Confirmation Dialog** system using React Context and Material-UI.
This will allow any component to trigger a confirmation dialog asynchronously and await the user's response, replacing `window.confirm`.

## Scope
-   **Frontend**:
    -   Create `ConfirmationContext` and `ConfirmationProvider`.
    -   Create `ConfirmationDialog` component.
    -   Expose a `useConfirm` hook.
    -   Integrate the provider into the application root.
    -   Refactor `SigningInterface.jsx` to use the new hook.

## Risks
-   **Breaking Changes**: None, this is additive. Existing `window.confirm` calls will still work until replaced.
-   **Complexity**: Using Promises for UI interactions can be tricky if not handled correctly (e.g., component unmounting while dialog is open), but standard patterns exist to handle this.
