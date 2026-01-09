# notebook Spec Delta

## ADDED Requirements

### Requirement: Note Management

Users SHALL be able to create, view, update, and delete personal notes.

#### Scenario: Create Note

- **GIVEN** user is on the Notebook page
- **WHEN** user clicks "New Note"
- **THEN** an empty note MUST be created
- **AND** the editor MUST focus for immediate typing

#### Scenario: Edit Note

- **GIVEN** user has existing notes
- **WHEN** user selects a note from the list
- **THEN** the note content MUST display in the editor
- **AND** user MUST be able to modify the content

#### Scenario: Delete Note

- **GIVEN** user has selected a note
- **WHEN** user clicks delete
- **THEN** a confirmation MUST appear
- **AND** upon confirmation, the note MUST be deleted

---

### Requirement: Auto-Save

Notes SHALL auto-save after user stops typing.

#### Scenario: Auto-Save Trigger

- **WHEN** user stops typing for 2 seconds
- **THEN** the note MUST automatically save to the server
- **AND** a save indicator MUST show briefly
