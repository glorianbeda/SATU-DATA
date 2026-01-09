# Admin Storage Management Specification

## ADDED Requirements

### Requirement: Admin Document Management

Super Admin and Admin roles MUST be able to view and delete documents from all users.

#### Scenario: Admin views all documents

- GIVEN user has Super Admin or Admin role
- WHEN user navigates to Admin > Documents page
- THEN user sees list of all uploaded documents
- AND can filter by user, date, or status

#### Scenario: Admin deletes a document

- GIVEN admin is viewing documents list
- WHEN admin clicks delete on a document
- THEN confirmation modal appears
- AND on confirm, document is soft-deleted
- AND original uploader sees "File telah dihapus admin" message
