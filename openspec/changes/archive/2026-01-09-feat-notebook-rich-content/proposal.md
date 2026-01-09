# Proposal: Rich Text and Image Support for Notebook

## Goal
Enhance the Notebook feature by adding support for image attachments (specifically as cover images) and rich text formatting (bold, italic, lists, etc.) with a mobile-friendly editing experience.

## Problem
Currently, notes only support plain text. Users want to:
1.  Visually distinguish notes with images (cover images).
2.  Format text for better readability and emphasis.
3.  Have a seamless formatting experience on mobile (e.g., selection popup/toolbar).

## Solution
1.  **Database**: Add `coverImage` field to `Note` model.
2.  **Backend**: Update Note APIs to handle `coverImage`. Ensure generic image upload endpoint exists.
3.  **Frontend Editor**: Replace `InputBase` (plain text) with a Rich Text Editor (**TipTap** recommended) that supports:
    -   Basic formatting: Bold, Italic, Strike, Lists (Bullet/Ordered).
    -   Bubble Menu: Floating toolbar on text selection (Mobile/Desktop friendly).
    -   Cover Image: UI to upload/view/remove cover image.
4.  **Frontend Card**: Update `NoteCard` to render `coverImage` at the top (Masonry friendly).

## Key Features
-   **Cover Image**: Notes can have a header image visible in Grid and Editor.
-   **Rich Text**: Bold, Italic, Lists.
-   **Mobile UX**: Formatting options via selection menu or bottom toolbar.

## Risks
-   **Migration**: Existing plain text notes need to be compatible with HTML/JSON content of the new editor. TipTap handles HTML content well.
-   **Image Storage**: Need to ensure efficient image storage and serving (Multer -> storage folder).

## Timeline
Phase 1: Database & Backend (Image Upload)
Phase 2: Frontend Editor Integration (TipTap)
Phase 3: Integration & Polish
