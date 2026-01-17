# Design: Server-side Label Generation

## Architecture

### Label Generation Service
- **Input**: List of assets (Name, Code, QR content), Layout configuration (Grid size, Label dimensions).
- **Process**:
    1.  Generate HTML string with embedded CSS for layout (Grid or Single).
    2.  Use `puppeteer` to launch a headless browser (or connect to existing).
    3.  Set content and render to PDF buffer.
- **Output**: PDF Buffer.

### API
- `POST /api/inventory/labels/generate`
    - Body: `{ assets: [], config: { type: 'single' | 'bulk' } }`
    - Response: `application/pdf`

## Layout Design
- **Single Label**: 7cm x 3.5cm (standard sticker size).
- **Bulk**: A4 Sheet with grid layout (e.g., 3 cols x 8 rows).
- **Styling**:
    - Use system fonts (Inter/Roboto).
    - clear contrast for Barcode/QR.
    - Minimalist border.
