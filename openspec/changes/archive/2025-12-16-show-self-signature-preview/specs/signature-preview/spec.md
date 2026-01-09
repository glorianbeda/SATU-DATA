# Signature Preview Specification

## MODIFIED Requirements

### Requirement: Self-Sign Signature Preview

When a user signs a document in self-sign mode, the annotation preview MUST display their actual signature image.

#### Scenario: User places signature annotation in self-sign mode

- GIVEN a user is in self-sign mode
- AND the user has a saved signature in their profile
- WHEN they place a signature annotation on the document
- THEN the preview MUST show their actual signature image
- AND NOT show placeholder text like "XX" or "Tanda Tangan"

#### Scenario: User without saved signature places annotation

- GIVEN a user is in self-sign mode
- AND the user does NOT have a saved signature
- WHEN they place a signature annotation
- THEN the preview should show "Tanda Tangan" placeholder
