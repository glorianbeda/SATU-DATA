# Proposal: Improve Label Printing Experience

## Background
Currently, the "Cetak Label" feature uses the browser's `window.print()`, leading to inconsistent results across browsers and printers. The design is basic and lacks polish. The user expects a direct PDF download with a neat layout.

## Objective
- Replace client-side printing with server-side PDF generation using Puppeteer.
- Improve label design to be professional and neat.
- Ensure "Cetak" button triggers a direct PDF download.

## Solution
1.  **Backend**: Introduce a PDF generation service using `puppeteer`.
2.  **API**: New endpoint to generate label PDFs.
3.  **Frontend**: Update components to consume the API and trigger downloads.

## Risks
- **Performance**: PDF generation can be CPU intensive.
- **Dependency**: Puppeteer adds significant size to `node_modules` and requires system dependencies.

## Alternatives Considered
- **Client-side PDF (jspdf)**: Lacks the high-fidelity rendering of HTML/CSS that Puppeteer offers, making complex layouts harder.
