## ADDED Requirements

### Requirement: Auto-Show Signature Preview in Self-Mode

When a user places a signature annotation in self-signing mode, the system MUST display their actual signature image (if available) instead of placeholder text.

#### Scenario: User has saved signature

- GIVEN a user has a signature image saved in their profile
- AND the user is in self-sign mode
- WHEN they place a signature annotation on the document
- THEN the annotation box displays their actual signature image
- AND the signature image is scaled to fit the annotation box

#### Scenario: User has no saved signature

- GIVEN a user has no signature image in their profile
- WHEN they place a signature annotation in self-sign mode
- THEN the annotation box displays placeholder text "Tanda Tangan"
- AND a tooltip suggests setting up a signature in profile

### Requirement: Font Size Control for Annotations

The annotation tool panel MUST provide a font size control that allows users to adjust the text size of annotations with real-time preview.

#### Scenario: Adjusting font size with slider

- GIVEN a user is on the annotation step
- WHEN they adjust the font size slider (range 8-24px)
- THEN all text annotations immediately update to reflect the new font size
- AND the selected font size is applied to new annotations

#### Scenario: Font size applied to new annotations

- GIVEN a user has set the font size to 16px
- WHEN they create a new text or date annotation
- THEN the annotation uses 16px font size
- AND the font size is saved with the annotation data

### Requirement: Thicker Signature Stroke

The signature drawing canvas MUST use a thicker stroke width to produce clearer, more readable signatures.

#### Scenario: Drawing signature with thicker stroke

- GIVEN a user is on the profile page
- WHEN they draw a signature on the canvas
- THEN the stroke width is visibly thicker than a thin line (2-3px minimum)
- AND the resulting signature image is clear and readable

## MODIFIED Requirements

### Requirement: Real-Time Annotation Preview

All draggable annotations MUST display their actual content value instead of placeholder labels. The preview MUST update in real-time when content changes.

#### Scenario: Date annotation shows actual date

- GIVEN a user places a date annotation
- THEN the annotation displays today's date in localized format
- AND NOT the text "Tanggal"

#### Scenario: Text annotation shows live input

- GIVEN a user is editing a text annotation
- WHEN they type text
- THEN the annotation preview updates in real-time with the typed content

#### Scenario: Signature annotation shows actual signature

- GIVEN a user has a saved signature
- AND they are in self-sign mode
- WHEN they place a signature annotation
- THEN the annotation shows their actual signature image
- AND NOT just the text "Tanda Tangan"
