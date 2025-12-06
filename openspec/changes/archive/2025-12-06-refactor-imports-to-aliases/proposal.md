# Refactor Imports to Aliases

## Why
The user requested to apply the recently configured module aliases (`@` for backend, `~` for frontend) to all existing files in the codebase to ensure consistency and readability.

## What
1.  **Backend**:
    - Identify all `require` statements using relative paths (e.g., `../../`).
    - Replace them with absolute paths using the `@` alias (e.g., `@/routers/...`).
2.  **Frontend**:
    - Identify all `import` statements using relative paths (e.g., `../../`).
    - Replace them with absolute paths using the `~` alias (e.g., `~/components/...`).

## Impact
- **Backend**: Multiple files in `backend/routers`, `backend/middleware`, etc.
- **Frontend**: Multiple files in `frontend/src/features`, `frontend/src/pages`, etc.
