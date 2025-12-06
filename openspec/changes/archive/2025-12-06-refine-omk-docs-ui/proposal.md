# Refine OMK Docs UI

## Why
The user requested a UI refinement for the OMK Docs feature to improve navigation and consistency. Specifically, they want to replace the current tab-based interface with a sidebar-driven navigation structure containing three specific sub-menus: "Minta tanda tangan" (Request Signature), "Perlu Ditandatangani" (Inbox), and "Validasi dokumen" (Validate). This aligns with the "Keuangan" menu structure and provides a better SPA experience.

## What
1.  **Sidebar Update**: Modify `Sidebar.jsx` to make "OMK Docs" a parent menu with three children.
2.  **Routing**: Refactor `DocsPage` to handle sub-routes corresponding to the sidebar items.
3.  **Validation UI**: Implement the frontend interface for document validation (currently backend-only).
4.  **UI Consistency**: Ensure all new views follow the application's design theme (MUI/Tailwind).

## Impact
- **Frontend**:
    - `Sidebar.jsx`: Structure change.
    - `DocsPage.jsx`: Refactor to layout/router.
    - New components/routes for `ValidateDocument`.
- **Specs**:
    - `omk-docs`: Update scenarios to reflect specific navigation flows.
