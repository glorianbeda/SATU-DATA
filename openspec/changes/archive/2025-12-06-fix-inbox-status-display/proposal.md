# Fix Inbox Status Display

## Why
The user reported that signed documents are still showing as "Pending" in the Inbox, despite the database showing them as "SIGNED".
Investigation revealed a bug in `Inbox.jsx` where `getStatusChip` was being called with the status string instead of the request object, causing the logic to fall back to the default "Pending" state.

## What
1.  **Frontend**:
    - Update `frontend/src/features/omk-docs/components/Inbox.jsx` to pass the entire `req` object to `getStatusChip`.

## Impact
- **Frontend**: `Inbox.jsx`.
