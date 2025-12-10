# Design: Enhance Annotation Rendering

## Database Schema
Update `SignatureRequest` model:

```prisma
model SignatureRequest {
  // ... existing fields
  type      String   @default("signature") // signature, text, date, initial
  text      String?  // Content for text/date
  width     Float?   // Width in PDF units (normalized or absolute?) -> Let's use normalized (0-1) or relative to PDF size?
                     // Current implementation uses normalized x/y.
                     // Let's store width/height as normalized values (0-1) relative to page size to be consistent with x/y.
  height    Float?
}
```

**Decision**: Store `width` and `height` as **normalized values (0-1)**, similar to `x` and `y`. This ensures that if the PDF is resized (unlikely for existing files, but good for consistency), the relative proportion is maintained.
However, `AnnotateStep` currently calculates `refWidth` and `refHeight`.
If we send `width / refWidth` and `height / refHeight`, we get normalized dimensions.

## Backend Logic (`POST /sign`)

### Signature Rendering
-   Retrieve `width` and `height` from `request`.
-   If `width` is present, calculate target width in PDF points: `targetWidth = request.width * pageWidth`.
-   Scale image to `targetWidth`.

### Text/Date Rendering
-   If `type` is `TEXT` or `DATE`:
    -   Load standard font (StandardFonts.Helvetica).
    -   Calculate font size based on `request.height` (to fit the box).
    -   `page.drawText(request.text, { x, y, size, font })`.

## Frontend Logic
-   `ConfirmStep` needs to calculate normalized width/height before sending.
    -   `w = annotation.width / annotation.refWidth`
    -   `h = annotation.height / annotation.refHeight`
