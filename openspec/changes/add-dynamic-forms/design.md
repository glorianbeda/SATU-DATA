# Design: Dynamic Forms

## Data Models (Prisma)

### `Form`
-   `id`: String (UUID)
-   `title`: String
-   `description`: String?
-   `slug`: String (Unique, for public URLs)
-   `schema`: Json (Stores field definitions: generic type, label, required, options)
-   `isActive`: Boolean (Default: true)
-   `settings`: Json (Stores limits like `limitOneResponsePerUser`, `limitOneResponsePerDevice`)
-   `createdBy`: User (Relation)
-   `createdAt`, `updatedAt`

### `FormResponse`
-   `id`: String (UUID)
-   `formId`: String (Relation to Form)
-   `userId`: String? (Relation to User, nullable for guests)
-   `guestName`: String? (Required if userId is null)
-   `data`: Json (Stores the answers: `key: value`)
-   `ipAddress`: String? (For device metrics/limiting)
-   `userAgent`: String?
-   `submittedAt`: DateTime

## API Design

### Form Management
-   `POST /api/forms`: Create new form.
-   `PUT /api/forms/:id`: Update form schema/settings.
-   `DELETE /api/forms/:id`: Soft delete form.
-   `GET /api/forms`: List user's forms (Dashboard).
-   `GET /api/forms/:slug`: Get public form schema (for rendering).

### Responses
-   `POST /api/forms/:slug/submit`: Submit response.
    -   Validates session (auto-fill user).
    -   Validates guest name if no session.
    -   Checks limits (IP/User check).
-   `GET /api/forms/:id/responses`: Get all responses for a form (Owner only).

## Frontend Architecture

### Feature Module: `src/features/dynamic-forms`
-   **Components**:
    -   `FormBuilder`: Uses `@dnd-kit` for dragging fields (Text, Number, Date, Select, Checkbox).
    -   `FormRenderer`: Renders the form based on JSON schema. Used in preview and public view.
    -   `ResponseTable`: customization of `DataTable` to show dynamic columns based on form schema.

### Pages
-   `/forms`: Dashboard (List of forms).
-   `/forms/create`: Builder page.
-   `/forms/:id/edit`: Builder page (edit mode).
-   `/forms/:id/responses`: Response view (Excel-like).
-   `/f/:slug`: Public accessible route for filling the form.

### UX/UI
-   **Dashboard**: Card view for forms showing status, response count, last updated.
-   **Builder**: Split view or Canvas + Sidebar for tools.
-   **Response View**: Reuses `frontend/src/pages/finance/income` style table for consistency.
