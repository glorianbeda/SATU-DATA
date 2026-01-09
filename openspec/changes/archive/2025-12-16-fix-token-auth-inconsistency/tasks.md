# Tasks: Fix Token Authentication Inconsistency

## 1. OMK-Docs Components

- [x] 1.1 Update `DocumentUpload.jsx` - remove localStorage token, use withCredentials
- [x] 1.2 Update `DocumentUploadStep.jsx` - remove localStorage token, use withCredentials
- [x] 1.3 Update `ConfirmStep.jsx` - remove localStorage token, use withCredentials
- [x] 1.4 Update `SignerSetupPanel.jsx` - remove localStorage token, use withCredentials
- [x] 1.5 Update `SignatureRequestWizard.jsx` - remove localStorage token, use withCredentials
- [x] 1.6 Update `SigningInterface.jsx` - remove localStorage token, use withCredentials
- [x] 1.7 Update `SignaturePlacer.jsx` - remove localStorage token, use withCredentials
- [x] 1.8 Update `Inbox.jsx` - remove localStorage token, use withCredentials
- [x] 1.9 Update `AssignSignerStep.jsx` - remove localStorage token, use withCredentials

## 2. Profile Components

- [x] 2.1 Update `ChangePasswordForm.jsx` - remove localStorage token, use withCredentials

## 3. Layout Components

- [x] 3.1 Update `AppLayout.jsx` - use credentials: 'include' with fetch

## 4. Verification

- [x] 4.1 Frontend build passes
- [ ] 4.2 Manual testing - document upload
- [ ] 4.3 Manual testing - signature request flow
- [ ] 4.4 Manual testing - profile updates
