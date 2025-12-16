# Change: Add Image Splitter Tool

## Why
User memerlukan fitur untuk membagi gambar besar menjadi beberapa bagian dengan ukuran sel default A4. Fitur ini berguna untuk mencetak gambar dalam format poster atau display besar yang terdiri dari beberapa lembar A4.

## What Changes
- **Frontend**: Add new Image Splitter tool accessible from sidebar "Tools" section
- **New Feature**: Add new page `/tools/image-splitter` for image splitting functionality
- **UI Components**: 
  - Image upload interface
  - Preview canvas with adjustable crop section
  - Row/column configuration inputs
  - Grid overlay showing A4 cell boundaries
  - Draggable crop section for positioning
  - Export/download functionality for split images

## Impact
- Affected specs: New `image-splitter` capability
- Affected code:
  - `frontend/src/components/Sidebar.jsx` - Add menu item
  - `frontend/src/pages/tools/image-splitter.jsx` - New page
  - `frontend/src/features/tools/` - New feature folder
  - `frontend/src/locales/*.json` - Translation keys
