# Change: Refactor Frontend Navigation Structure

## Why
Struktur folder frontend saat ini tidak sesuai dengan hierarki menu di sidebar. Selain itu, setiap halaman masih berupa single file (misal `notebook.jsx`) bukan folder-based (`notebook/index.jsx`). Ini membuat pelacakan file sulit dan tidak konsisten dengan best practices.

## What Changes
- **Page Structure**: Setiap halaman menjadi folder dengan `index.jsx` di dalamnya
  - `notebook.jsx` → `notebook/index.jsx`
  - `todo.jsx` → `todo/index.jsx`
  - dll.
- **Reorganisasi Tools**: Grup halaman tools menjadi struktur parent-child
  - `productivity/` → Catatan dan To-Do
  - `utilities/` → Image Splitter dan tools utilitas lainnya
- **Update Page Generator**: Update `scripts/make-page.js` untuk membuat folder + `index.jsx`
- **Update Sidebar Paths**: Update paths di `Sidebar.jsx` sesuai struktur baru

## Impact
- Affected specs: `frontend`, `page-loading`, `navigation-performance`
- Affected code:
  - `frontend/src/pages/tools/` → reorganisasi ke folder-based
  - `frontend/scripts/make-page.js` → update generator
  - `frontend/src/components/Sidebar.jsx` → update paths
