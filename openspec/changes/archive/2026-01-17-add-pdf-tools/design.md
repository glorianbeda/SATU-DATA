# Design: PDF Tools Architecture

## Client-Side Processing
To ensure data privacy and reduce server load, all PDF operations will be performed **client-side** using WebAssembly/JavaScript libraries.

### Libraries
-   **pdf-lib**: Core library for structural manipulation (Split, Merge, Remove Pages, Rotate).
-   **react-pdf** (pdfjs-dist): Used for rendering pages to UI for preview.
-   **jspdf**: Used for creating new PDFs from images.
-   **jszip**: Used for bundling split files or images into a downloadable archive.

## Feature Implementation Strategies

### 1. PDF Compress
**Challenge**: True compression (deduplication, stream compression) is hard in JS.
**Strategy**: "Lossy" optimization.
    -   Render pages to Canvas at defined quality (e.g., 72 DPI, 0.7 JPEG quality).
    -   Re-assemble into a new PDF using `jspdf`.
    -   Best for scanned documents/images.

### 2. PDF Editor (Page Org)
-   Load PDF with `pdf-lib`.
-   Extract page indices.
-   UI: Sortable Grid (local state).
-   Save: Create new PDFDocument, copy pages from original based on new order/rotation.

### 3. PDF Splitter
-   UI: Select split points or ranges.
-   Save: Create multiple PDFDocuments, save each.
-   Download: Zip file if multiple.

### 4. PDF Converter
-   **PDF to Image**: Render page canvas -> `.toDataURL()` -> Download `jpeg/png`.
-   **Image to PDF**: Load images -> `jspdf.addImage()` -> Save.

## Navigation
Update `frontend/src/config/navigation.js` to include the `pdf` subgroup under `tools`.
