# Spec: Visual Timeline

## ADDED Requirements

### Requirement: Timeline Visualization
The system MUST display an intuitive visual timeline of the loan's lifecycle to keep users informed.

#### Scenario: Visualizing Loan Lifecycle
GIVEN I am viewing a Loan Detail or the Dashboard
THEN I see a visual timeline component representing the loan stages
AND the stages include: `Requested` -> `Approved` -> `Borrowed` -> `Return Verified` -> `Completed`
AND the current stage is highlighted

#### Scenario: Snake Layout
GIVEN there are many stages or detailed descriptions
THEN the timeline layout should follow a "Snake" (S-shape) or multi-line path if space is constrained, rather than a single overflowing horizontal line
AND it should be responsive to screen width
