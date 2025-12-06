# OMK-Docs Spec Delta - Enhanced Document Signing

## MODIFIED Requirements

### Requirement: Document Upload Interface

The system MUST provide a premium, step-by-step wizard for requesting document signatures.

#### Scenario: Wizard-based Upload Flow

Given a user navigates to "Minta Tanda Tangan"
When the page loads
Then the user MUST see a multi-step wizard with progress indicators
And the steps MUST be: Upload → Annotate → Assign Signer → Confirm

#### Scenario: Drag-and-Drop Upload

Given the user is on the Upload step
When they drag a PDF file onto the upload area
Then the file MUST be accepted and previewed
And a thumbnail of the first page MUST be displayed

## ADDED Requirements

### Requirement: Annotation Tools Panel

The system MUST provide a tools panel when placing annotations on a PDF document.

#### Scenario: Tools Panel Display

Given a user has uploaded a PDF and is on the Annotate step
When the PDF viewer loads
Then a tools panel MUST appear on the right side of the screen
And the panel MUST contain: Signature, Date, Text, and Initial tools

#### Scenario: Drag Annotation to PDF

Given the tools panel is visible
When the user drags a tool (e.g., Date) onto the PDF
Then a draggable placeholder MUST appear at the drop location
And the user MUST be able to reposition it by dragging

#### Scenario: Multiple Annotations

Given the user has placed a Signature annotation
When they drag another Signature tool onto the PDF
Then a second Signature placeholder MUST be added
And both MUST be independently positionable

### Requirement: File-based Document Validation

The system MUST allow users to validate documents by uploading the PDF file.

#### Scenario: Upload for Validation

Given a user navigates to "Validasi Dokumen"
When they upload a PDF file
Then the system MUST calculate the file's checksum
And compare it against the database
And display whether the document is valid/authentic

#### Scenario: Valid Document Found

Given a user uploads a signed PDF that exists in the database
When the checksum matches
Then the system MUST display "Document is Authentic"
And show document title, uploader, upload date, and signatures

#### Scenario: Invalid Document

Given a user uploads a PDF that has been modified
When the checksum does not match any record
Then the system MUST display "Document Not Found or Modified"

### Requirement: QR Code on Signed Documents

The system MUST embed a QR code on documents after all signatures are complete.

#### Scenario: QR Code Generation

Given all signature requests for a document are completed
When the final signature is applied
Then the system MUST generate a QR code containing a validation URL
And embed the QR code in the bottom-right corner of the last page

#### Scenario: QR Code Scanning

Given a user scans the QR code on a signed document
When they open the link
Then they MUST be directed to the validation page
And the document details MUST be displayed automatically
