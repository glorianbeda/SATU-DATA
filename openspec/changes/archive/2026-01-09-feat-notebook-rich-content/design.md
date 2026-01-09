# Design: Notebook Rich Content

## Architecture

### Database
Update `Note` model in `schema.prisma`:
```prisma
model Note {
  // ... existing fields
  coverImage String? @db.Text // URL or path to image
  // content is already String? @db.LongText, will now store HTML
}
```

### Backend API
1.  **New Endpoint**: `POST /api/uploads/image`
    -   Uses `multer` to save file to `public/uploads/images`.
    -   Returns `{ url: '/uploads/images/filename.jpg' }`.
2.  **Update Note Endpoints**:
    -   `GET /api/notes`: Select `coverImage`.
    -   `POST /api/notes`: Accept `coverImage`.
    -   `PUT /api/notes/:id`: Accept `coverImage`.

### Frontend Editor (TipTap)
We will use **TipTap** for the editing experience.
-   **Dependencies**: `@tiptap/react`, `@tiptap/starter-kit` (includes Bold, Italic, History, etc.), `@tiptap/extension-placeholder`.
-   **Component**: `RichTextEditor.jsx`.
-   **Toolbar**:
    -   **BubbleMenu**: Appears on text selection (Ideal for mouse users).
    -   **Fixed Menu/Bar**: For mobile users where selection might be tricky, or as "Formatting options" above keyboard (if possible) or at top of Dialog.
    -   Let's place a **Fixed Toolbar** at the bottom of the Dialog header or top of content area for consistency on Mobile & Desktop.
-   **Cover Image UI**:
    -   "Add Cover" button (if none).
    -   Image preview at top of Dialog (removable).

### Data Migration
Existing plain text content will render correctly in TipTap (it treats plain text as paragraphs). Saving it back will convert to HTML (e.g., `<p>text</p>`).

## UX/UI
### Masonry Card
-   If `coverImage` exists, render `<img src={...} />` at the top of the card (full width).
-   Content preview: Strip HTML tags for the card preview text logic (`activeNote.content.replace(/<[^>]+>/g, '')`).

### Mobile Interaction
-   **Keyboard**: When keyboard opens, ensure toolbar is accessible.
-   **Selection**: Long press to select -> Bubble Menu shows Bold/Italic/etc.
