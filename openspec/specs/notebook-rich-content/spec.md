# notebook-rich-content Specification

## Purpose
TBD - created by archiving change feat-notebook-rich-content. Update Purpose after archive.
## Requirements
### Requirement: Cover Image Attachment
Notes MUST support a cover image attachment.

#### Scenario: Adding a cover image
Given I am editing a note
When I select an image file to upload via the "Add Cover" button
Then the image is displayed at the top of the note editor
And saving the note persists the cover image association.

#### Scenario: Removing a cover image
Given I have a note with a cover image
When I click the "Remove" button on the cover image in the editor
Then the image is removed from the note display
And saving the note removes the cover image association.

### Requirement: Rich Text Formatting
The Note Editor MUST support rich text formatting.

#### Scenario: Basic formatting
Given I am editing a note
When I type text and apply Bold, Italic, or Strikethrough formatting
Then the text is visually rendered with improved styling
And the formatting is preserved when saved.

#### Scenario: Lists
Given I am editing a note
When I Create a Bullet List or Ordered List
Then the editor behaves as a list editor (indentation, bullets).

### Requirement: Card Cover Display
Note Cards in the grid MUST display the cover image.

#### Scenario: Grid display
Given a note has a cover image
When I view the note in the Masonry Grid
Then the card displays the image at the very top, preserving aspect ratio (or cropping appropriately).

### Requirement: Card Content Preview
Note Cards MUST display plain text preview of rich content.

#### Scenario: Previewing HTML content
Given a note has rich text content (HTML tags)
When the note is displayed in the Grid Card
Then HTML tags are stripped or rendered safely
And only the text content is shown in the preview execution.

