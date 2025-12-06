# OMK-Docs Spec Delta - Improved Signature Flow

## MODIFIED Requirements

### Requirement: Signature Request Wizard

The system MUST provide a streamlined wizard for requesting document signatures with mode selection.

#### Scenario: Mode Selection

Given a user navigates to "Minta Tanda Tangan"
When the wizard loads
Then the user MUST see two options: "Tanda Tangan Sendiri" and "Minta Tanda Tangan"
And each option MUST be displayed as a clickable card with description

#### Scenario: Self-Sign Mode Selection

Given the user is on the mode selection step
When they click "Tanda Tangan Sendiri"
Then the wizard MUST proceed to the upload step
And the signer selection panel MUST NOT be shown in the annotate step
And the current user MUST be auto-assigned as signer for all annotations

#### Scenario: Request Mode Selection

Given the user is on the mode selection step
When they click "Minta Tanda Tangan"
Then the wizard MUST proceed to the upload step
And the signer selection panel MUST be shown in the annotate step

## ADDED Requirements

### Requirement: Combined Annotate and Assign Step

The system MUST allow users to select a signer before placing annotations.

#### Scenario: Signer Selection Before Annotation

Given the user is on the annotate step in request mode
When they want to place a signature annotation
Then they MUST first select a user from the signer list panel
And the selected user MUST be highlighted
And only then can they place the annotation on the PDF

#### Scenario: Annotation Shows Signer Badge

Given the user has selected a signer and placed an annotation
When the annotation is rendered on the PDF
Then it MUST display a badge showing the signer's name
And the badge MUST be styled with a distinct color

#### Scenario: Multiple Signers Per Document

Given the user has placed an annotation for one signer
When they select a different signer from the list
And place another annotation
Then each annotation MUST be associated with its respective signer
And the confirm step MUST show all signers and their annotations

### Requirement: Self-Sign Immediate Signing

The system MUST immediately sign documents when using self-sign mode.

#### Scenario: Self-Sign Confirmation

Given the user is in self-sign mode
When they reach the confirm step
Then the action button MUST display "Tanda Tangani Sekarang"
And clicking it MUST immediately apply the signature
And the document MUST be saved with an embedded QR code

#### Scenario: Self-Sign Completion

Given the user has confirmed a self-sign
When the signing completes
Then the system MUST display a success message
And the user MUST be redirected to view the signed document
