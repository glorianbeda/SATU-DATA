# Tasks: Add Task Sharing

## Phase 1: Database Schema

- [x] Add `TaskList` model to schema.prisma
- [x] Add `TaskListMember` model to schema.prisma
- [x] Modify `Task` model (add taskListId, assigneeId)
- [x] Add User relations (OwnedTaskLists, TaskListMemberships, AssignedTasks)
- [x] Run data migration: create default TaskList per user, move existing tasks
- [x] Run prisma db pull & generate

---

## Phase 2: Backend API - TaskList

- [x] `GET /api/task-lists` - List user's TaskLists
- [x] `POST /api/task-lists` - Create TaskList
- [x] `PUT /api/task-lists/:id` - Update TaskList
- [x] `DELETE /api/task-lists/:id` - Delete TaskList

---

## Phase 3: Backend API - Members

- [x] `GET /api/task-lists/:id/members` - List members
- [x] `POST /api/task-lists/:id/members` - Invite member
- [x] `PUT /api/task-lists/:id/members/:userId` - Update permission
- [x] `DELETE /api/task-lists/:id/members/:userId` - Remove member
- [x] Add permission check in task endpoints

---

## Phase 4: Backend API - Tasks Update

- [x] Update `GET /api/tasks` to filter by taskListId
- [x] Update `POST /api/tasks` to require taskListId
- [x] Update `PUT /api/tasks/:id` with editor access check
- [x] Update `DELETE /api/tasks/:id` with editor access check
- [x] Update `PUT /api/tasks/reorder` with taskListId
- [x] Add query param for "assigned to me" filter

---

## Phase 5: Frontend - TaskList Selector

- [x] Add TaskList dropdown/selector in To-Do page
- [x] Create TaskList dialog (create/edit)
- [x] Persist selected list in localStorage

---

## Phase 6: Frontend - Member Management

- [x] Create Member list component
- [x] Create Invite member dialog with user search
- [x] Add permission toggle (viewer/editor)
- [x] Add remove member functionality

---

## Phase 7: Frontend - Task Assignment

- [x] Add assignee selector in task card/dialog
- [x] Show assignee avatar on task card
- [x] Add "Assigned to me" filter tab

---

## Phase 8: Testing & Polish

- [x] Improve mobile drag responsiveness (TouchSensor with delay)
- [ ] Test TaskList CRUD
- [ ] Test member invite/remove
- [ ] Test task assignment
- [ ] Test permission enforcement
- [ ] Add translations (id.json, en.json)
