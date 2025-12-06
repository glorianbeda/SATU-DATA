# Tasks

- [x] Create `SignerSetupPanel` component (search user + list + self-sign checkbox)
- [x] Update `DocumentUploadStep` to include `SignerSetupPanel`
- [x] Update `SignatureRequestWizard` to manage `signers` state
- [x] Update `AnnotateStep` to use passed `signers` instead of fetching/searching
- [x] Update `SignerListPanel` to be "selection only" (remove search)
- [x] Verify flow: Upload -> Add Signers -> Annotate -> Confirm
- [x] Fix `CircularProgress` import error in `SignatureRequestWizard`
- [x] Improve `currentUser` filtering in `SignerSetupPanel`
- [x] Suppress 409 Conflict error in `DocumentUploadStep`
