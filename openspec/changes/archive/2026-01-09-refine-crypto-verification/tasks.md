# Tasks: Refine Crypto Verification

## Phase 1: Translations

### 1.1 Add Missing Translation Keys

- [x] Add `docs.hash_verification` key to id.json and en.json
- [x] Add `docs.signature_valid` key
- [x] Add `docs.signature_invalid` key
- [x] Add `docs.not_signed_yet` key
- [x] Add `docs.algorithm` key
- [x] Add `docs.original_hash` key
- [x] Add `docs.signed_hash` key

---

## Phase 2: UI Simplification

### 2.1 Remove Checksum Tab

- [x] Modify `ValidateDocument.jsx`
- [x] Remove Tabs component (no need for tabs with single option)
- [x] Keep only file upload dropzone
- [x] Update UI layout for single verification method

---

## Phase 3: Clean PDF Output

### 3.1 Embed Invisible Metadata

- [x] Modify `backend/utils/pdfQrCode.js`
- [x] Remove `embedQRCodeInPDF` visible footer (QR, text, line)
- [x] Add `embedVerificationMetadata` function:
  - Set PDF metadata: Subject, Keywords, Producer, Creator
  - Store verification code in metadata
- [x] Verify PDF looks clean without any visible changes

### 3.2 Update Sign Endpoint

- [x] `embedQRCodeInPDF` now calls `embedVerificationMetadata` (backward compat)
- [x] signedHash calculated correctly

---

## Phase 4: Verification

- [x] File upload verification still works (same API)
- [x] PDF output is clean (no visible watermark)
- [x] Translations display correctly

