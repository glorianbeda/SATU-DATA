# Improve Page Transition

## Why
The user reports that page transitions feel slow and lack immediate feedback ("stuck for a while").
Currently, the application relies on `React.Suspense` with a `PageLoader` fallback, but the user perception indicates this isn't sufficient or immediate enough.
Adding a top progress bar (`nprogress`) is a standard pattern to provide immediate visual feedback during route transitions, improving perceived performance.

## What
1.  **Frontend**:
    - Install `nprogress`.
    - Update `frontend/src/components/PageLoader.jsx` to trigger `NProgress.start()` on mount and `NProgress.done()` on unmount.
    - Import `nprogress` CSS in `frontend/src/main.jsx` or `frontend/src/index.css`.
    - Optionally, refine `PageLoader` visual style if needed, but primarily add the progress bar.

## Impact
- **Frontend**: `PageLoader.jsx`, `main.jsx`, `package.json`.
