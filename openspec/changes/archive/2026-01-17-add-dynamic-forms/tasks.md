# Tasks: Dynamic Forms

## Backend
- [x] Create Prisma schema for `Form` and `FormResponse`
- [x] Run migration and generate client
- [x] Implement `POST /api/forms` (Create)
- [x] Implement `PUT /api/forms/:id` (Update)
- [x] Implement `GET /api/forms` (List) & `GET /api/forms/:id` (Detail)
- [x] Implement `GET /api/forms/public/:slug` (Public Access)
- [x] Implement `POST /api/forms/:slug/submit` (Submission with validation)
- [x] Implement `GET /api/forms/:id/responses` (Data retrieval)

## Frontend
- [x] Create `features/dynamic-forms/components/FormBuilder` (Drag & Drop UI)
- [x] Create `features/dynamic-forms/components/FormRenderer` (Public View UI)
- [x] Create `features/dynamic-forms/components/ResponseTable` (Excel-like View)
- [x] Implement Page: `/forms` (Dashboard)
- [x] Implement Page: `/forms/create` & `/forms/:id/edit`
- [x] Implement Page: `/forms/:id/responses`
- [x] Implement Page: `/f/:slug` (Public Route)
- [x] Integrate API with Frontend components
- [x] Add 'Forms' to Sidebar Menu
- [x] Add Translations (en/id)
- [x] Auto-generate unique Slugs (Hide input)
- [x] Refactor FormBuilder (Inline Editing, Remove Properties Panel)
- [x] Update Application Logos (Sidebar: xm, Small: xs)
