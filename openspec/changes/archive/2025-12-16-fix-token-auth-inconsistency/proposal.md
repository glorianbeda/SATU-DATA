# Fix Token Authentication Inconsistency

## Why

Users experience **401 Unauthorized "Invalid token"** errors on document upload despite being freshly logged in. The root cause is an inconsistent authentication pattern:

- **Login endpoint** sets token in **httpOnly cookie** (not accessible via JavaScript)
- **Finance module** uses `withCredentials: true` (cookie-based) ✅
- **OMK-Docs module** reads `localStorage.getItem('token')` which is **never set**, resulting in `Authorization: Bearer null` → backend rejects with "Invalid token"

## What Changes

1. **Standardize all API calls** to use `withCredentials: true` for cookie-based auth
2. **Remove all `localStorage.getItem('token')`** patterns from frontend code
3. **Remove all `Authorization: Bearer ${token}` headers** since cookies are automatically sent with `withCredentials: true`

## User Review Required

> [!IMPORTANT]
> After this fix, all authentication will rely solely on **httpOnly cookies**. This is more secure than localStorage tokens but requires the backend CORS to be properly configured (which it already is).

## Affected Files

### Frontend - OMK-Docs Components
- `features/omk-docs/components/DocumentUpload.jsx`
- `features/omk-docs/components/wizard/DocumentUploadStep.jsx`
- `features/omk-docs/components/wizard/ConfirmStep.jsx`
- `features/omk-docs/components/wizard/SignerSetupPanel.jsx`
- `features/omk-docs/components/SignatureRequestWizard.jsx`
- `features/omk-docs/components/SigningInterface.jsx`
- `features/omk-docs/components/SignaturePlacer.jsx`
- `features/omk-docs/components/Inbox.jsx`

### Frontend - Profile Components
- `features/profile/components/ChangePasswordForm.jsx`
- `features/profile/components/ProfileEditForm.jsx`

### Frontend - Layout Components
- `components/AppLayout.jsx`
