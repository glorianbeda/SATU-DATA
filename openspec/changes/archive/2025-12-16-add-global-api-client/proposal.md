# Add Global API Client

## Why

Currently each component has its own axios call with `withCredentials: true` scattered throughout the codebase. This leads to:
- Code duplication
- Inconsistent configuration
- Harder maintenance

## What Changes

Create a centralized axios instance in `frontend/src/utils/api.js` with:
- Pre-configured `baseURL` from environment
- Pre-configured `withCredentials: true`
- Optional interceptors for error handling

Then update all components to use this shared instance.

## User Review Required

> [!NOTE]
> This will reduce code duplication and make future API configuration changes easier (e.g., adding auth headers, error interceptors).

## Affected Files

### New File

- `frontend/src/utils/api.js` - Centralized axios instance

### Components to Update

All 11 components previously modified will be updated to import and use the global `api` client instead of creating individual axios calls.
