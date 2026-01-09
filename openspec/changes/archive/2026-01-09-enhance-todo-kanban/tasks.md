# Tasks: Enhance To-Do Kanban

## Phase 1: Database & API Updates

- [x] Update `Task` model: add `dueDate`, `completedAt`, `description`, `priority`, `category`
- [x] Run prisma db push
- [x] Update `PUT /api/tasks/:id` to handle new fields
- [x] Update `GET /api/tasks` to return new fields
- [x] Add filter/sort query params to `GET /api/tasks`

---

## Phase 2: Enhanced Kanban UI

- [x] Make whole card draggable (remove drag handle, use card as handle)
- [x] Redesign task card with:
  - Title (bold)
  - Description preview (2 lines max)
  - Due date badge with calendar icon
  - Priority badge (color-coded: red/orange/green)
  - Category tag chip
- [x] Add hover effects and lift animation on drag
- [x] Add "In Progress" column (3 columns: Pending, In Progress, Completed)
- [x] Show `completedAt` date on completed tasks
- [x] Overdue indicator (red) for past due dates

---

## Phase 3: Multiple View Modes

- [x] Create view mode toggle (Kanban / Table / List)
- [x] Implement **Kanban View** (existing, enhanced)
- [x] Implement **Table View**:
  - Columns: Checkbox, Title, Status, Priority, Category, Due Date, Actions
  - Sortable columns (click header to sort)
  - Inline status change
- [x] Implement **List View**:
  - Simple checklist style
  - Compact rows with checkbox, title, due date
  - Click to expand details
- [x] Persist view mode preference to localStorage

---

## Phase 4: Task Detail Modal

- [x] Create TaskDetailModal component
- [x] Click card opens modal with full edit form:
  - Title input
  - Description textarea (multiline)
  - Due date picker
  - Priority select
  - Category input/autocomplete
- [x] Save changes on modal close or explicit save

---

## Phase 5: Filter & Sort

- [x] Add search bar (filter by title/description)
- [x] Add filter dropdowns: priority, category, date range
- [x] Add sort dropdown: newest, oldest, due soon, priority
- [x] Persist filter/sort to localStorage

---

## Phase 6: User Tips / Onboarding

- [x] Create Tips component (tooltip or modal)
- [x] Show on first visit:
  - "Drag task ke kolom lain untuk ubah status"
  - "Klik task untuk edit detail"
  - "Gunakan filter untuk fokus pada prioritas tertentu"
  - "Set due date agar tidak lupa deadline"
  - "Switch view mode sesuai preferensi"
- [x] Add "Don't show again" checkbox
- [x] Store preference in localStorage
- [x] Optional: Add floating help (?) button

---

## Phase 7: Polish & Translations

- [x] Add all new translation keys (id.json)
- [x] Add all new translation keys (en.json)
- [x] Responsive design for mobile
- [x] Empty state illustrations
- [x] Loading skeletons

