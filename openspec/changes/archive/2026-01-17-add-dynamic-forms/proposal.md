# Dynamic Forms Feature

## Background
The user requires a feature similar to Google Forms where authenticated users can create dynamic forms with rich features. These forms can be shared with both registered users and guests. The system needs to handle session-based auto-filling for registered users and require guest names for non-registered users. Additionally, form owners can set submission limits (e.g., one per account/device).

## Goal
Implement a comprehensive Dynamic Forms module that allows:
1.  **Form Creation**: Drag-and-drop interface to build forms with various field types.
2.  **Public/Private Access**: Shareable links for users and guests.
3.  **Submission Management**: Logic to handle guest names vs. authenticated user sessions and enforce submission limits.
4.  **Dashboard**: A management area for form owners to view active forms and responses in an Excel-like table format.

## Scope
-   **Frontend**:
    -   New feature module: `src/features/dynamic-forms`.
    -   Pages: Form Builder, Form List (Dashboard), Public Form View, Response View.
    -   UX: Drag-and-drop builder, responsive design, Excel-like data table for responses.
-   **Backend**:
    -   New Prisma models: `Form`, `FormResponse`, `FormLimit`.
    -   API endpoints for Form CRUD and Response submission.
    -   Validation logic for guest/auth users and submission limits.

## Non-Goals
-   Complex logic branching (logic jumps) within forms in this initial version (keep it linear).
-   Payment integration within forms.
