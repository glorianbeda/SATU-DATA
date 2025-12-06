# OMK-Docs Spec Delta - Fix PDF Viewer Layout

## MODIFIED Requirements

### Requirement: PDF Viewer Layout

The PDF viewer in AnnotateStep MUST stay within parent container bounds.

#### Scenario: PDF Content Scrolling

Given a user is on the annotate step with a multi-page document
When the document is taller than the visible area
Then the PDF canvas area MUST have internal vertical scrolling
And the content MUST NOT overflow the parent container
