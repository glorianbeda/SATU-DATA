# Tasks

## Phase 1: Mode Selection

- [x] Create `ModeSelectionStep.jsx` component with two cards
- [x] Update `SignatureRequestWizard.jsx` to include mode selection as first step
- [x] Update wizard state to track `mode: 'self' | 'request'`
- [x] Conditionally show steps based on selected mode

## Phase 2: Combined Annotate + Assign

- [x] Create `SignerListPanel.jsx` component (left panel)
- [x] Modify `AnnotateStep.jsx` to include signer selection panel
- [x] Update annotation data structure to include `signerId` and `signerName`
- [x] Show signer badge on each annotation
- [x] Require signer selection before placing signature/initial annotations
- [x] Remove `AssignSignerStep.jsx` (no longer needed) - kept for backwards compat, not used

## Phase 3: Self-Sign Mode

- [x] Skip signer panel when mode is 'self'
- [x] Auto-assign current user as signer for all annotations
- [x] After confirm, immediately sign document (instead of creating request)
- [x] Redirect to signed document view

## Phase 4: Update Confirm Step

- [x] Update `ConfirmStep.jsx` to handle both modes
- [x] Show different action button: "Kirim Permintaan" vs "Tanda Tangani Sekarang"
- [x] For self-sign: call sign endpoint directly
- [x] For request: create signature requests as before

## Phase 5: Polish

- [x] Test self-sign flow end-to-end
- [x] Test request flow end-to-end
- [x] Ensure QR code is embedded for self-signed documents
- [x] Update instructions text based on mode
