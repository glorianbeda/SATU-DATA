# OMK-Docs Spec Delta - Refine Signature Setup

## MODIFIED Requirements

### Requirement: Signer Selection

Signer selection MUST happen during the document upload/setup phase.

#### Scenario: Adding Signers during Upload
Given a user is in the "Request Signature" wizard
When they are on the Upload step
Then they MUST be able to search and add multiple signers
And they MUST be able to check "I also want to sign" to add themselves as a signer

### Requirement: Annotation Step Signers

The Annotation step MUST use the pre-selected list of signers.

#### Scenario: Using Selected Signers
Given a user has selected signers in the Upload step
When they proceed to the Annotate step
Then the sidebar MUST list only the selected signers
And they MUST NOT be able to add new signers in this step
