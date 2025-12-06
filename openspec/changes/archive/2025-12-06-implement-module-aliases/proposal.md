# Implement Module Aliases

## Why
The user requested consistent module import aliases to simplify file imports and improve code readability.
- Backend: Use `@` to refer to the root (or specific folders).
- Frontend: Use `~` to refer to `src`.

## What
1.  **Backend**:
    - Install `module-alias`.
    - Configure `package.json` to define `@` as the root directory (or specific subdirectories if preferred, but `@` usually maps to root or src). Given the user said "backend (pakai @)", I'll map `@` to the backend root.
    - Add `require('module-alias/register')` at the top of `index.js`.
2.  **Frontend**:
    - Update `vite.config.js` to resolve `~` to `src`.
    - Create/Update `jsconfig.json` to support intellisense for `~`.

## Impact
- **Backend**: `package.json`, `index.js`.
- **Frontend**: `vite.config.js`, `jsconfig.json`.
- **Codebase**: This change enables the usage. It does NOT imply refactoring the entire codebase immediately, but we should probably update a few files to verify it works, or at least set it up for future use. The user said "terapkan" (apply), which might imply refactoring. I will set it up and maybe refactor one or two instances to prove it, but refactoring *everything* might be huge. I'll stick to configuration first, as "terapkan" can mean "implement the capability".

## Alternative Considered
- **Native Node Imports**: Requires `#` prefix (e.g. `#root/`). User specifically asked for `@`.
