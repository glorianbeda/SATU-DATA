# Improve OMK-Docs

## Why

Multiple improvements and bug fixes needed for the OMK-Docs (signature document) feature to enhance usability, fix bugs, and add requested functionality.

## What Changes

### 1. Admin Document Storage Management
Super Admin/Admin can view and delete any document. When deleted, users see "File telah dihapus admin" message instead of the document.

### 2. "Sudah Ditandatangani" (Signed Documents) Tab
Add new tab in Inbox showing documents that user has already signed.

### 3. Delayed Upload (Draft Mode)
Documents are not uploaded immediately when selected. They remain in draft/temporary state until user submits the signature request.

### 4. QR Code Alternative for Validation
Replace large QR code in bottom-right corner with a smaller, less intrusive validation indicator (small QR in footer or text-only verification code).

### 5. Bug Fix: Double Submit Button
Fix duplicate submit buttons appearing in self-sign mode causing documents to be signed twice.

### 6. Bug Fix: Preview vs Result Text Mismatch
Fix text annotations rendering differently (shifted position, larger size) between preview and final signed document.

## Affected Areas

- Backend: Document routes, admin routes
- Frontend: Inbox component, AnnotateStep, ConfirmStep, SigningInterface
- Database: Document model (soft delete/status flag)
