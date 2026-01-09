# Tasks: Redesign Notebook UI

## Phase 1: Database & Backend
- [x] Add `isPinned` and `color` fields to `Note` model in `schema.prisma`
- [x] Run migration (`db push` or list migration steps)
- [x] Update `GET /api/notes` to sort by `isPinned` (desc) then `updatedAt` (desc)
- [x] Update `POST /api/notes` and `PUT /api/notes/:id` to accept `color` and `isPinned`

## Phase 2 & 3: Frontend Implementation
- [x] Create `NoteCard` component with visual styling (color, content preview)
- [x] Create `NoteEditorModal` for editing (title, content, color picker)
- [x] Refactor `NotebookPage` to use Masonry Layout (CSS Columns)
- [x] Implement toggle for Pinned/Unpinned sections
- [x] Frontend Responsive Logic (Masonry Columns)

## Phase 4: Polish & Responsive
- [x] Adjust column counts for breakpoints (xs: 1, sm: 2, md: 3, lg: 4)
- [x] Add animations for card hover/click (via CSS transition)
- [x] Ensure dark mode colors are harmonious (defined in palette)
- [x] Add translations (id.json)
