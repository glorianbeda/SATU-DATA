# Tasks: Refactor Frontend Navigation Structure

## 1. Update Page Generator Script

- [x] 1.1 Update `scripts/make-page.js` untuk membuat folder + `index.jsx`

## 2. Reorganisasi Folder Tools

- [x] 2.1 Buat struktur `pages/tools/productivity/`
- [x] 2.2 Pindahkan `notebook.jsx` ke `productivity/notebook/index.jsx`
- [x] 2.3 Pindahkan `todo.jsx` ke `productivity/todo/index.jsx`
- [x] 2.4 Buat struktur `pages/tools/utilities/`
- [x] 2.5 Pindahkan `image-splitter.jsx` ke `utilities/image-splitter/index.jsx`

## 3. Update Sidebar Paths

- [x] 3.1 Update `bottomItems` paths di `Sidebar.jsx`:
  - `/tools/todo` → `/tools/productivity/todo`
  - `/tools/notebook` → `/tools/productivity/notebook`
  - `/tools/image-splitter` → `/tools/utilities/image-splitter`

## 4. Testing

- [x] 4.1 Test `yarn make:page` dengan path baru
- [x] 4.2 Test navigasi semua menu tools di sidebar
- [x] 4.3 Verifikasi tidak ada 404 errors
