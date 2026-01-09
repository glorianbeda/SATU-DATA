# Design: Task Sharing

## Database Schema

### New Models

```prisma
model TaskList {
  id          Int       @id @default(autoincrement())
  name        String
  description String?   @db.Text
  ownerId     Int
  owner       User      @relation("OwnedTaskLists", fields: [ownerId], references: [id], onDelete: Cascade)
  members     TaskListMember[]
  tasks       Task[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model TaskListMember {
  id          Int       @id @default(autoincrement())
  taskListId  Int
  taskList    TaskList  @relation(fields: [taskListId], references: [id], onDelete: Cascade)
  userId      Int
  user        User      @relation("TaskListMemberships", fields: [userId], references: [id], onDelete: Cascade)
  permission  String    @default("EDITOR") // VIEWER, EDITOR
  invitedAt   DateTime  @default(now())
  
  @@unique([taskListId, userId])
}
```

### Modified Task Model

```diff
model Task {
  id          Int       @id @default(autoincrement())
- userId      Int
- user        User      @relation("UserTasks", ...)
+ taskListId  Int
+ taskList    TaskList  @relation(fields: [taskListId], references: [id], onDelete: Cascade)
+ assigneeId  Int?
+ assignee    User?     @relation("AssignedTasks", fields: [assigneeId], references: [id])
  title       String
  ...
}
```

## API Endpoints

### TaskList Management
- `GET /api/task-lists` - List user's TaskLists (owned + member of)
- `POST /api/task-lists` - Create new TaskList
- `PUT /api/task-lists/:id` - Update TaskList
- `DELETE /api/task-lists/:id` - Delete TaskList (owner only)

### Member Management
- `GET /api/task-lists/:id/members` - List members
- `POST /api/task-lists/:id/members` - Invite member
- `PUT /api/task-lists/:id/members/:userId` - Update permission
- `DELETE /api/task-lists/:id/members/:userId` - Remove member

### Tasks (Modified)
- `GET /api/task-lists/:listId/tasks` - Get tasks in list
- `POST /api/task-lists/:listId/tasks` - Create task in list
- `PUT /api/tasks/:id/assign` - Assign task to user

## Frontend Components

### Updated To-Do Page
```
┌─────────────────────────────────────────────┐
│ [My Tasks ▼] [+ New List]                   │
├─────────────────────────────────────────────┤
│ Tabs: [All] [Assigned to me] [Created by me]│
├─────────────────────────────────────────────┤
│                                             │
│  PENDING     IN PROGRESS     COMPLETED      │
│  ┌────────┐  ┌────────────┐  ┌──────────┐  │
│  │ Task 1 │  │ Task 2     │  │ Task 3   │  │
│  │ @UserB │  │ @UserA     │  │ @UserB   │  │
│  └────────┘  └────────────┘  └──────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### Member Invite Dialog
- Search users by name/email
- Select permission level
- Send invite

## Migration Strategy

1. Create TaskList for each existing user ("Personal" default list)
2. Move existing tasks to user's default TaskList
3. Set assigneeId = null for existing tasks
