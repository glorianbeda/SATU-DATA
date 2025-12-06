# Change: Add OMK DOCS Signature System

## Why
To implement "OMK DOCS", a digital signature system allowing users to sign documents, request signatures from others, and validate document authenticity.

## What Changes
- **Database**: Add `Document` and `SignatureRequest` models.
- **Backend**:
    - Endpoints for uploading PDF documents.
    - Endpoints for creating signature requests (with coordinates).
    - Endpoints for signing (applying signature image) and rejecting.
    - Endpoint for document validation (checksum).
- **Frontend**:
    - PDF Viewer with Drag & Drop support for signature placement.
    - Dashboard for managing incoming/outgoing requests.

## Impact
- **Affected specs**: `omk-docs` (New Capability)
- **Affected code**: New feature directory `frontend/src/features/omk-docs`, Backend `document` modules.
