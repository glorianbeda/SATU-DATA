# Tasks: Notebook Rich Content

## Phase 1: Database & Backend
- [x] Add `coverImage` field to `Note` model in `schema.prisma`
- [x] Run migration (`db push`)
- [x] Create `backend/routers/api/uploads/POST__image/index.js` for generic image upload
- [x] Update `GET /api/notes` to select `coverImage`
- [x] Update `POST /api/notes` and `PUT /api/notes/:id` to accept `coverImage`

## Phase 2: Frontend Dependencies & Components
- [x] Install TipTap dependencies (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/extension-image`)
- [x] Create `RichTextEditor` component with Bubble Menu (Bold, Italic, List)
- [x] Update `NoteCard` to display `coverImage` if present
- [x] Update `NoteCard` to strip HTML tags for text preview

## Phase 3: Integration
- [x] Integrate file upload logic in `NoteEditorDialog` (Add/Remove Cover)
- [x] Replace content `InputBase` with `RichTextEditor` in `NoteEditorDialog`
- [x] Ensure Mobile Toolbar/Bubble Menu usability
- [x] Verify persistence of HTML content and Cover Image
