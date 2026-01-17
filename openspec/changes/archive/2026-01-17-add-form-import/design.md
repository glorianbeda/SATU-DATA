# Design: Form Schema Import

## Architecture

### Environment Restriction
The core requirement is to restrict this feature to development environments.
- **Backend Guard**: The API endpoint `/api/forms/import` will check `process.env.NODE_ENV === 'development'`. If not, it returns 403 Forbidden.
- **Frontend Guard**: The UI element (Import button) will be conditionally rendered based on `import.meta.env.DEV` (Vite's built-in dev flag) or a specific `VITE_ENABLE_FORM_IMPORT` flag if more granular control is needed.

### Data Format
The JSON format should match the structure expected by the `POST /api/forms` payload, generally:
```json
{
  "title": "String",
  "description": "String",
  "slug": "String (optional, auto-generated if missing)",
  "schema": [ ... field definitions ... ],
  "settings": { ... }
}
```

### UX
- A simple button "Import JSON" in the `/forms` dashboard header.
- Opens a Dialog.
- Option to Paste JSON or Upload File (for simplicity, we'll start with Paste JSON as it's easier to implement and sufficient for dev tools).
- Validation feedback (invalid JSON, schema errors).

## UX Refinements (Mobile & Settings)

### Mobile Responsiveness
- **Issue**: Top-right buttons (e.g., Save, Actions) are hard to reach/visualize on mobile.
- **Solution**: Move primary actions to a sticky bottom bar or ensure they wrap correctly on smaller screens.
- **Scope**: `CreateFormPage`, `EditFormPage`, and potentially `PublicFormPage`.

### Response Limiting
- **Requirement**: "Limit 1 response per device" (cookie/localStorage based).
- **Implementation**:
    - **Settings**: Add a simple toggle `limitOnePerDevice` in the form settings (frontend).
    - **Public View**: Check `localStorage` for a flag `submitted_${formId}`.
        - If present, show "You have already responded".
    - **Backend**: (Optional for now, but good to have) No strict IP check requested, focusing on "device" (cookie/storage) as per user request for "guest" handling.

