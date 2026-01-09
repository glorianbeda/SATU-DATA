# Tasks: Add Productivity Tools

## Phase 1: Database Schema

- [x] Add `Task` model (id, userId, title, description, status, order, createdAt, updatedAt)
- [x] Add `Note` model (id, userId, title, content, createdAt, updatedAt)
- [x] Run prisma db push

---

## Phase 2: Backend API

### 2.1 To-Do List API

- [x] `GET /api/tasks` - List user's tasks
- [x] `POST /api/tasks` - Create task
- [x] `PUT /api/tasks/:id` - Update task (title, status, order)
- [x] `DELETE /api/tasks/:id` - Delete task
- [x] `PUT /api/tasks/reorder` - Batch reorder tasks

### 2.2 Notebook API

- [x] `GET /api/notes` - List user's notes
- [x] `POST /api/notes` - Create note
- [x] `PUT /api/notes/:id` - Update note
- [x] `DELETE /api/notes/:id` - Delete note

---

## Phase 3: Frontend - To-Do List

- [x] Create `/pages/tools/productivity/todo/index.jsx`
- [x] Install `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop
- [x] Create Kanban-style UI with 3 columns (Pending, In Progress, Completed)
- [x] Implement drag-and-drop with animations
- [x] Add task CRUD UI (add, edit, delete)
- [x] Add translations (id.json, en.json)

---

## Phase 4: Frontend - Notebook

- [x] Create `/pages/tools/productivity/notebook/index.jsx`
- [x] Create note list sidebar + editor panel
- [x] Implement simple markdown/plain text editor
- [x] Add note CRUD UI
- [x] Add translations

---

## Phase 5: Navigation & Polish

- [x] Add menu items in Sidebar (To-Do List, Notebook under "ALAT > Produktivitas")
- [x] Verify responsive design
- [x] Test all features
