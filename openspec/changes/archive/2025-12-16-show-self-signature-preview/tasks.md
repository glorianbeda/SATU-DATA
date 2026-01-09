# Tasks: Show Self-Sign Signature Preview

## 1. Investigation

- [x] 1.1 Check profile API response to verify signature field name
- [x] 1.2 Debug `getSignatureUrl` to see what value `currentUser` contains

## 2. Frontend Fix

- [x] 2.1 Update `getSignatureUrl` in `AnnotateStep.jsx` to use correct field name
- [x] 2.2 Handle case where signature URL might be relative or absolute
- [x] 2.3 Show signature image for INITIAL (paraf) type too, not just SIGNATURE

## 3. Backend (if needed)

- [x] 3.1 Ensure profile API includes user's signature URL (already includes `sign` field)

## 4. Verification

- [x] 4.1 Build passes
- [ ] 4.2 Manual testing - self-sign mode shows actual signature preview
