## MODIFIED Requirements

### Requirement: DataTable Responsiveness
The DataTable component SHALL adapt to different screen sizes to ensure data is viewable on mobile devices.

#### Scenario: Viewing table on mobile
- **GIVEN** a DataTable component is rendered
- **AND** the viewport width is small (mobile)
- **WHEN** the table content exceeds the viewport width
- **THEN** the table MUST be horizontally scrollable
- **AND** the layout MUST NOT break or overflow the parent container
