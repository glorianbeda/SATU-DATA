# Bug Fixes Specification

## ADDED Requirements

### Requirement: Self-Sign Submission

Self-sign mode MUST only allow a single submission per document.

#### Scenario: User submits self-signed document

- GIVEN user is in self-sign mode on ConfirmStep
- WHEN user clicks the submit/sign button
- THEN the button MUST be disabled immediately
- AND a loading indicator MUST appear
- AND only ONE signature request is created

### Requirement: Annotation Preview Consistency

Text annotations MUST render identically in preview and final signed document.

#### Scenario: Text annotation position matches

- GIVEN user places a text annotation at position (x, y)
- AND user sets font size to N px
- WHEN document is signed and generated
- THEN text MUST appear at the SAME relative position
- AND text MUST be the SAME font size as preview
