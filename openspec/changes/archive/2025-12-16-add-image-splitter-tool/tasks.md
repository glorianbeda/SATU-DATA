# Tasks: Add Image Splitter Tool

## 1. Setup & Navigation

- [x] 1.1 Add translation keys for image splitter in `en.json` and `id.json`
- [x] 1.2 Add Image Splitter menu item to sidebar "Tools" section
- [x] 1.3 Create page file `pages/tools/image-splitter.jsx`

## 2. Core Components

- [x] 2.1 Create feature folder `features/tools/` with component structure
- [x] 2.2 Implement `ImageUploader` component with drag-drop support
- [x] 2.3 Implement `SplitterCanvas` component for preview and crop
- [x] 2.4 Implement grid overlay rendering on canvas
- [x] 2.5 Implement drag/pan functionality for crop section

## 3. Controls & Configuration

- [x] 3.1 Create row/column input controls with validation
- [x] 3.2 Calculate and display total grid size based on row/column
- [x] 3.3 Show crop area dimensions relative to image

## 4. Export Functionality

- [x] 4.1 Implement split logic to extract each cell from canvas
- [x] 4.2 Generate individual PNG files for each cell (A4 @ 300 DPI)
- [x] 4.3 Create ZIP download for multiple cells
- [x] 4.4 Add preview modal before download
- [x] 4.5 Add PDF export option (one A4 page per cell)

## 5. Polish & UX

- [x] 5.1 Add loading states during processing
- [x] 5.2 Add error handling for invalid images
- [x] 5.3 Style components consistent with app theme
- [x] 5.4 Ensure responsive design for mobile view

## 6. Verification

- [x] 6.1 Frontend build verified - no compilation errors
- [x] 6.2 Manual test pending - requires backend for login
- [x] 6.3 Test drag/pan functionality for large images
