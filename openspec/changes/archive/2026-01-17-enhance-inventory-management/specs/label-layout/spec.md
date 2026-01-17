# Label Layout Improvements

## MODIFIED Requirements

### Requirement: Enhanced Label Content
Asset labels MUST include serial number and maintain readability with 3 per row layout.

#### Scenario: Label includes serial number
Given the user generates a label for an asset
When the PDF is generated
Then the label should display the serial number clearly
And the label should contain: logo, asset name, serial number, category, location, asset code, and QR code

#### Scenario: Bulk labels with 3 per row
Given the user generates bulk labels for multiple assets
When the PDF is generated on A4 paper
Then labels should be arranged in 3 columns per row
And each label should have dimensions approximately 6cm × 3cm
And the QR code should remain scannable

#### Scenario: Label dimensions maintain usability
Given labels are printed with new dimensions
When a user attempts to scan the QR code
Then the QR code should be recognized by standard QR readers
And all text should be legible
