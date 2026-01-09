# Proposal: Redesign Notebook UI (Keep-like)

User wants a Google Keep-style interface for the Notebook, specifically optimizing for mobile responsiveness and aesthetics.

## Goal
Transform the current text-heavy Master-Detail view into a modern, visual **Masonry Grid layout** (like Google Keep). This involves updating the database to support visual metadata (colors, pins) and rewriting the frontend to be mobile-first.

## Scope

### 1. Database Schema
- Modify `Note` model:
  - Add `isPinned` (Boolean, default false)
  - Add `color` (String, default "default" or hex)
  - Add `tags` (String/JSON, optional - maybe Phase 2, let's stick to core visual first)

### 2. Frontend UI (Mobile & Desktop)
- **Layout**: CSS Multi-column (Masonry) layout.
  - Mobile: 1 column.
  - Tablet: 2 columns.
  - Desktop: 3-4 columns.
- **Components**:
  - `NoteCard`: Displays title, truncated content, color background, pin status.
  - `NoteEditorModal`: Dialog for creating/editing notes (replacing the split-pane editor).
  - **Mobile Bottom Bar**: Floating dock with "Add Note", "Search", etc.
  - **Filter Chips**: "All", "Pinned", "Colors".
- **Interactions**:
  - Click card to edit.
  - Long press (mobile) or Hover (desktop) to reveal actions (Delete, Pin, Color).

### 3. Backend API
- Update `GET /api/notes` to support sorting (Pinned first, then updated).
- Update `POST/PUT` to handle `color` and `isPinned`.

## User Interface Design
- **Aesthetic**: Rounded corners (XL), flat colors, dark mode support.
- **Mobile Experience**: Bottom navigation/action bar is critical for one-handed use.

## Comparison
| Feature | Current | Proposed |
|qs---|---|---|
| Layout | Split View (List + Editor) | Masonry Grid (Cards) |
| Mobile | Squashed Split View | Vertical Card Stack |
| Editing | Inline Right Panel | Modal / Fullscreen Dialog |
| Metadata | Title + Content only | + Color, Pinned Status |

