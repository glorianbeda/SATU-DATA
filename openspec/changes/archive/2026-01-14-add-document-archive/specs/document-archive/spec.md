# document-archive Specification Delta

## ADDED Requirements

### Requirement: File Upload with Size Limit

The system MUST allow users to upload files of any type with a maximum size of 150MB.

#### Scenario: Uploading a valid file

Given the user is on the archive page
When they upload a file smaller than 150MB
Then the file is saved and displayed in the file list
And a success message is shown

#### Scenario: Uploading an oversized PDF

Given the user is on the archive page
When they upload a PDF file larger than 150MB
Then a modal appears suggesting to compress the PDF
And clicking "Compress" navigates to the PDF compress tool
And the file is auto-populated in the compress tool

#### Scenario: Uploading an oversized non-PDF file

Given the user is on the archive page
When they upload a non-PDF file larger than 150MB
Then an error message is shown indicating the file exceeds the size limit

### Requirement: Folder/Category Organization

The system MUST provide folder/category organization with predefined categories and custom folders.

#### Scenario: Creating a folder

Given the user is on the archive page
When they click "New Folder" and enter a name
Then the folder is created and appears in the folder tree

#### Scenario: Selecting a category

Given the user is uploading a file
When they select a category from the dropdown
Then the file is tagged with that category
And the category guide popover appears if it's the first time

### Requirement: File Preview

The system MUST provide in-browser preview for common file formats.

#### Scenario: Previewing a PDF

Given the user is viewing the file list
When they click on a PDF file
Then a preview modal opens showing the PDF content

#### Scenario: Previewing an image

Given the user is viewing the file list
When they click on an image file
Then a preview modal opens showing the image

### Requirement: Search and Filter

The system MUST allow users to search and filter files.

#### Scenario: Searching by filename

Given the user is on the archive page
When they enter a search term in the search box
Then the file list filters to show matching files

#### Scenario: Filtering by category

Given the user is on the archive page
When they select a category filter
Then only files in that category are displayed

### Requirement: File Sharing

The system MUST allow users to share files with others.

#### Scenario: Creating a share link

Given the user selects a file
When they click "Share" and generate a link
Then a shareable URL is created
And the link can be copied to clipboard

### Requirement: File Download

The system MUST allow users to download files.

#### Scenario: Downloading a single file

Given the user is viewing the file list
When they click the download button on a file
Then the file is downloaded to their device

#### Scenario: Bulk download

Given the user has selected multiple files
When they click "Download Selected"
Then all selected files are downloaded as a ZIP archive
