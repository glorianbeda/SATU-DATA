# Enhance Annotation Rendering

## Problem
1.  **Fixed Size**: Signature annotations are hardcoded to 100px width in the backend, ignoring the user's resizing in the frontend.
2.  **Missing Types**: Text and Date annotations are available in the UI but are not rendered onto the final PDF by the backend.
3.  **Scaling**: Annotation content does not scale with the box size.

## Solution
Update the backend to store annotation metadata (type, text, dimensions) and use this information to render annotations correctly on the PDF.

## Scope
-   **Database**: Add `type`, `text`, `width`, `height` columns to `SignatureRequest`.
-   **Backend**:
    -   Update `POST /api/documents/request-sign` to save new fields.
    -   Update `POST /api/documents/sign` to render Text and Date annotations using `pdf-lib`.
    -   Update `POST /api/documents/sign` to use stored dimensions for Signatures.
-   **Frontend**:
    -   Update `ConfirmStep` to send annotation details to the backend.

## Risks
-   **Migration**: Requires a database schema change.
-   **Font Handling**: Rendering text requires embedding fonts in `pdf-lib`. We need to ensure a standard font (e.g., Helvetica) is used.
