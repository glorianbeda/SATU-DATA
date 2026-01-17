# Tasks: Add PDF Tools

## Phase 1: Setup
- [x] Install dependencies: `pdf-lib`, `jszip`.
- [x] Update `frontend/src/config/navigation.js` to add PDF section.

## Phase 2: PDF Editor (Organize)
- [x] Create `frontend/src/pages/tools/pdf/editor/index.jsx`.
- [x] Implement File Upload & Preview Grid.
- [x] Implement Drag & Drop reordering (dnd-kit).
- [x] Implement Rotate/Delete actions.
- [x] Implement Save (pdf-lib).

## Phase 3: PDF Splitter
- [x] Create `frontend/src/pages/tools/pdf/split/index.jsx`.
- [x] Implement Range Selector UI.
- [x] Implement Split & Zip Download.

## Phase 4: PDF Converter
- [x] Create `frontend/src/pages/tools/pdf/convert/index.jsx`.
- [x] Implement Tabbed UI (PDF->Image, Image->PDF).
- [x] Implement Image->PDF logic (jspdf).
- [x] Implement PDF->Image logic (pdfjs render to canvas).

## Phase 5: PDF Compress
- [x] Create `frontend/src/pages/tools/pdf/compress/index.jsx`.
- [x] Implement Compression Level slider.
- [x] Implement Re-render logic (canvas -> jspdf).
- [x] Compare size & Download.
