# Proposal: Add Task Sharing

## Summary

Menambahkan fitur kolaborasi pada To-Do List dengan konsep **TaskList** (project container) dan **Task Assignment** (delegasi tugas ke user lain).

## Motivation

Saat ini To-Do List bersifat personal. Untuk tim yang bekerja bersama, dibutuhkan kemampuan:
- Membuat project bersama dengan multiple members
- Mendelegasikan tugas ke anggota tim
- Melihat progress tugas yang di-assign ke kita

## Scope

### In Scope

- **TaskList** - Container untuk mengelompokkan tasks (seperti project/board)
- **TaskList Members** - Invite user lain ke TaskList dengan permission (viewer/editor)
- **Task Assignment** - Assign task ke member tertentu
- **Shared View** - Tampilan "Shared with me" untuk melihat tasks dari orang lain
- **Notifications** - Notifikasi sederhana saat di-invite atau di-assign

### Out of Scope

- Real-time collaboration (websocket)
- Comments/discussions pada task
- Activity log/audit trail
- Email notifications

## Business Flow

```
1. User A membuat TaskList "Sprint 1"
2. User A invite User B sebagai editor
3. User A buat Task "Fix bug #123", assign ke User B
4. User B melihat task di tab "Assigned to me"
5. User B update status ke COMPLETED
6. User A melihat progress di TaskList
```

## Impact

- **Database**: Add 2 models (TaskList, TaskListMember), modify Task model
- **Backend**: New endpoints for TaskList CRUD, member management
- **Frontend**: Update To-Do page with list selector, shared view, member invite UI
