# Handle Upload Conflict and Filtering

## Problem
1.  **Upload Conflict**: When a user uploads a document that already exists (same checksum), the backend returns a `409 Conflict` error. This causes "red" error logs in the browser console, which confuses users, even if the frontend handles it gracefully.
2.  **User Filtering**: The signer selection dropdown includes the currently logged-in user, which is redundant since there is a dedicated "Self Sign" checkbox. Frontend filtering can be flaky if data isn't fully loaded.

## Solution
1.  **Idempotent Upload**: Modify `POST /api/documents/upload` to return `200 OK` (instead of 409) when a duplicate document is found. The response should include the existing document data and a flag (e.g., `exists: true`) to indicate it was not newly created. This eliminates the console error.
2.  **Backend User Filtering**: Modify `GET /api/users` to accept an `exclude_self=true` query parameter. When set, the backend will exclude the requesting user from the results. This ensures robust filtering regardless of frontend state.

## Scope
-   **Backend**:
    -   Update `backend/routers/api/documents/POST__upload/index.js`
    -   Update `backend/routers/api/GET__users/index.js`
-   **Frontend**:
    -   Update `DocumentUploadStep.jsx` to handle 200 OK with `exists: true` (and remove 409 handling).
    -   Update `SignerSetupPanel.jsx` to pass `exclude_self=true` when fetching users (if it fetches directly) or rely on the updated API if using a shared fetcher.
        -   *Note*: Currently `SignerSetupPanel` fetches users directly. We should update it to use the query param.

## Risks
-   **API Compatibility**: Changing 409 to 200 might break other clients if they rely strictly on 409 to detect duplicates. However, since this is an internal app, it should be fine. We will return `exists: true` to allow differentiation.
