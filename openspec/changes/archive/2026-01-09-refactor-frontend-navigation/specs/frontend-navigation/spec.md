## ADDED Requirements

### Requirement: Folder-Based Page Structure
Each page MUST be organized as a folder containing an `index.jsx` file instead of a single file.

#### Scenario: Page File Location
- **WHEN** developer creates a new page for "notebook" feature
- **THEN** file is located at `pages/.../notebook/index.jsx` not `pages/.../notebook.jsx`

#### Scenario: Co-located Files Support
- **WHEN** page needs additional files (components, styles, utils)
- **THEN** these files can be placed in the same folder as `index.jsx`

### Requirement: Hierarchical Page Organization
Frontend pages MUST be organized in a folder hierarchy that reflects the sidebar menu structure.

#### Scenario: Tools Productivity Group
- **WHEN** developer looks for To-Do or Notebook page files
- **THEN** files are located in `pages/tools/productivity/{feature}/index.jsx`

#### Scenario: Tools Utilities Group
- **WHEN** developer looks for Image Splitter or other utility tool pages
- **THEN** files are located in `pages/tools/utilities/{feature}/index.jsx`

### Requirement: Page Generator Script
The `make:page` script MUST generate folder-based page structure.

#### Scenario: Generate New Page
- **WHEN** developer runs `yarn make:page tools/productivity/notebook`
- **THEN** script creates `src/pages/tools/productivity/notebook/index.jsx`

### Requirement: Sidebar Path Synchronization
Sidebar navigation paths MUST be synchronized with the page folder structure.

#### Scenario: Sidebar Links Match Routes
- **WHEN** sidebar menu items are rendered
- **THEN** paths in `bottomItems` match actual page routes (e.g., `/tools/productivity/todo`)
