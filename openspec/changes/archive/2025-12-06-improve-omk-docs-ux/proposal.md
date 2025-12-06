# Improve OMK Docs UX

## Why
The user identified several UX issues and feature gaps in the OMK Docs module:
1.  **Upload Limit**: The current 10MB limit is too restrictive; users encounter "file too large" errors.
2.  **Feedback**: Large file uploads lack visual feedback (progress bar).
3.  **Clarity**: The signature request process needs clearer instructions (drag-and-drop box).
4.  **Efficiency**: Signers need a way to sign all pending requests/fields at once ("Agree & Sign All").

## What
1.  **Backend**:
    - Increase `uploadPdf` middleware limit to 50MB.
    - Increase Express `json` and `urlencoded` limits to 50MB in `index.js`.
2.  **Frontend**:
    - **DocumentUpload**: Add a progress bar using Axios `onUploadProgress`.
    - **SignaturePlacer**: Add a persistent instruction/tooltip about dragging the signature box.
    - **SigningInterface**: Add an "Agree & Sign All" button that iterates through all pending requests for the document and signs them.

## Impact
- **Backend**: Configuration changes only.
- **Frontend**: UX enhancements in existing components.

## Alternative Considered
- **Batch Sign Endpoint**: We could create a `POST /api/documents/sign-batch` endpoint. This is more efficient than multiple frontend calls. Given the "Sign All" requirement, a batch endpoint is cleaner and more atomic. I will propose adding a batch signing endpoint or modifying the existing one to handle arrays, but for simplicity and speed, frontend looping or a specific batch endpoint is fine. A batch endpoint is better for data integrity. I'll add a `POST /api/documents/sign-batch` endpoint.
