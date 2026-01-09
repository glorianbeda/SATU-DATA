# Proposal: Enhance To-Do Kanban

## Summary

Meningkatkan fitur To-Do List menjadi Kanban Board yang lebih lengkap dengan:
- Due date & completed date tracking
- Task description
- Improved drag-and-drop (whole card draggable)
- Modern Kanban UI
- Filter & sort functionality
- Category/label tags
- **Multiple view modes (Kanban, Table, List)**
- **Informative tips for new users**

## Motivation

Fitur To-Do sederhana sudah berfungsi, tetapi untuk produktivitas yang lebih baik diperlukan fitur tambahan seperti deadline tracking, deskripsi detail, dan pengorganisasian yang lebih baik.

## Scope

### In Scope

1. **Task Metadata**
   - `dueDate`: Tanggal deadline task
   - `completedAt`: Timestamp otomatis saat task diselesaikan
   - `description`: Deskripsi detail task (text/markdown)
   - `priority`: Low / Medium / High
   - `category`: Label/tag untuk kategorisasi (Design, Research, QA, etc.)

2. **Kanban UI Improvements**
   - Whole card draggable (bukan hanya icon)
   - Card design seperti reference image (title, description, due date, priority badge)
   - Progress indicator (subtasks)
   - Hover effects & smooth animations

3. **Multiple View Modes**
   - **Kanban View** (Default): Kolom-kolom drag & drop
   - **Table View**: Spreadsheet-style dengan sorting per kolom
   - **List View**: Simple checklist style (compact)
   - Toggle button di header untuk switch view
   - Persist preference to localStorage

4. **Filter & Sort**
   - Filter by: status, priority, category, due date range
   - Sort by: created date, due date, priority, title
   - Search functionality

5. **User Tips / Onboarding**
   - First-time user tips (tooltip/modal)
   - Tips examples:
     - "Drag task ke kolom lain untuk ubah status"
     - "Klik task untuk edit detail"
     - "Gunakan filter untuk fokus pada prioritas tertentu"
     - "Set due date agar tidak lupa deadline"
   - "Don't show again" option
   - Optional: floating help button (?)

6. **Custom Columns** (Optional Phase 2)
   - Default: Pending, In Progress, Completed
   - User bisa tambah/edit kolom custom

### Out of Scope (Recommended: Separate Module)

**Collaborative Features / User Tagging**

> **Senior Dev Recommendation:**
> 
> Fitur tagging user lain (assignee, mentions) sebaiknya **dipisah ke modul terpisah** karena:
> 
> 1. **Complexity**: Collaboration membutuhkan:
>    - Permission system (siapa bisa lihat/edit task siapa)
>    - Real-time sync (WebSocket/SSE)
>    - Notification system
>    - Activity log/audit trail
> 
> 2. **Scope Creep Risk**: Jika digabung sekarang, fitur akan membengkak dan sulit di-maintain
> 
> 3. **Reusability**: Collaboration system bisa dipakai ulang untuk fitur lain (dokumen, project, dll)
> 
> **Saran:** Implementasi **Personal Task Management** dulu (proposal ini), lalu buat modul terpisah **"Project Collaboration"** atau **"Team Tasks"** nanti.

## Related Changes

- `add-productivity-tools` (existing) - base implementation
