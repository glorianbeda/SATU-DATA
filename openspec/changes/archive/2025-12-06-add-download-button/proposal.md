# Add Download Button to Inbox

## Why
Users currently cannot download documents from the Inbox, which is a critical feature for accessing signed documents.

## What
1.  **Frontend**:
    - Update `frontend/src/features/omk-docs/components/Inbox.jsx` to add a "Download" button to the Action column for all requests.
    - The button will open the document's file path in a new tab.

## Impact
- **Frontend**: `Inbox.jsx`.
