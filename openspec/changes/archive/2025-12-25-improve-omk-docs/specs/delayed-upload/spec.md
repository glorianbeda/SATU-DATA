# Delayed Upload Specification

## ADDED Requirements

### Requirement: Document Upload Timing

Documents MUST NOT be uploaded to server until user submits signature request.

#### Scenario: User selects document without immediate upload

- GIVEN user is in DocumentUploadStep
- WHEN user selects a PDF file
- THEN file is stored locally (not uploaded to server)
- AND preview shows the local file

#### Scenario: Document uploads on submit

- GIVEN user has selected a document (stored locally)
- AND user has completed all wizard steps
- WHEN user clicks final submit button
- THEN document is uploaded to server
- AND signature request is created
