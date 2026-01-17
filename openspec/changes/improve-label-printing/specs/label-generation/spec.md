# Label Generation Spec

## ADDED Requirements

### Requirement: Print single label from Asset Details
The system SHALL provide a way to print a single asset label from the asset details page.

#### Scenario: User prints a single label
Given the user is on the Asset Details page
When they click "Cetak Label"
Then the system should generate a PDF for that single asset
And the PDF should download automatically
And the label size should be 7cm x 3.5cm

### Requirement: Print multiple labels from Inventory List
The system SHALL provide a way to print multiple asset labels from the inventory list.

#### Scenario: User prints multiple labels
Given the user is on the Inventory List
When they select multiple assets and click "Cetak Terpilih"
Then the system should generate a single PDF containing all labels
And the layout should be a grid on A4 paper
And the PDF should download automatically
