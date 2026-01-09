# Tasks: Improve OMK-Docs

## Phase 1: Bug Fixes (Priority) ✅

### 1.1 Double Submit Button (#5)

- [x] 1.1.1 Investigate ConfirmStep.jsx for duplicate button rendering
- [x] 1.1.2 Add loading state to prevent double submission
- [x] 1.1.3 Disable button after first click
- [x] 1.1.4 Hide wizard navigation on final step (only ConfirmStep button shown)

### 1.2 Preview vs Result Text Mismatch (#6)

- [x] 1.2.1 Compare annotation position calculation in preview vs signing
- [x] 1.2.2 Add fontSize field to Prisma schema
- [x] 1.2.3 Update request-sign to store fontSize
- [x] 1.2.4 Update sign endpoint to use stored fontSize
- [x] 1.2.5 Update frontend to send fontSize in API calls
- [x] 1.2.6 Fix zoom-independent coordinates using PDF original dimensions
- [x] 1.2.7 Add centering for signature and text within annotation box

## Phase 2: Signed Documents Tab (#2) ✅

- [x] 2.1 Add "Sudah Ditandatangani" tab to Inbox
- [x] 2.2 Filter requests by tab (pending vs signed)
- [x] 2.3 Display signed date for completed documents
- [x] 2.4 Dynamic column headers based on active tab

## Phase 3: Delayed Upload / Draft Mode (#3) ✅

- [x] 3.1 Store uploaded file locally (blob/base64) until submit
- [x] 3.2 Only upload to server on signature request submission
- [x] 3.3 Handle file cleanup if user cancels wizard
- [x] 3.4 Test upload only happens on final submit

## Phase 4: Admin Storage Management (#1) ✅

- [x] 4.1 Create admin documents list page (Super Admin/Admin only)
- [x] 4.2 Add soft-delete endpoint for documents
- [x] 4.3 Show "File telah dihapus admin" for deleted documents
- [x] 4.4 Add delete confirmation modal
- [x] 4.5 Test role-based access and delete functionality

## Phase 5: QR Code Alternative (#4) ✅

- [x] 5.1 Create smaller QR code component (footer placement)
- [x] 5.2 Add text-only verification code option
- [x] 5.3 Update PDF generation to use new validation display
- [x] 5.4 Test verification still works with new format

