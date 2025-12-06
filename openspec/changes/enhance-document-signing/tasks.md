# Tasks

## Phase 1: Redesign Upload Page

- [x] Create `SignatureRequestWizard.jsx` with step indicators
- [x] Redesign `DocumentUpload.jsx` with drag-drop area and better styling
- [x] Add document thumbnail preview after upload
- [x] Implement step navigation (Upload → Annotate → Assign → Confirm)

## Phase 2: Tools Panel Implementation

- [x] Create `ToolsPanel.jsx` component with tool buttons
- [x] Refactor `SignaturePlacer.jsx` to use ToolsPanel
- [x] Implement `DraggableSignature` component (existing, refactor)
- [x] Implement `DraggableDate` component (new)
- [x] Implement `DraggableText` component (new)
- [x] Implement `DraggableInitial` component (new)
- [x] Allow multiple instances of each tool type
- [x] Store annotation positions in state for submission

## Phase 3: Backend - File-based Validation

- [x] Create `POST /api/documents/validate-upload` endpoint
- [x] Accept file upload and calculate checksum
- [x] Compare with database and return result
- [x] Update `ValidateDocument.jsx` to use file upload instead of text input

## Phase 4: QR Code Embedding

- [x] Install `pdf-lib` and `qrcode` packages in backend
- [x] Create utility function to generate QR code image
- [x] Create utility function to embed QR into PDF footer
- [x] Modify signing endpoint to embed QR on final signature
- [x] Recalculate and store new checksum for signed document
- [x] Create signed document copy with unique filename

## Phase 5: Polish & Testing

- [x] Add loading states and error handling
- [x] Add translations for new UI elements
- [ ] Test wizard flow end-to-end
- [ ] Test validation with uploaded file
- [ ] Test QR code scanning and validation link
