# Design: Refactor Frontend Navigation Structure

## Context
Frontend menggunakan `vite-plugin-pages` untuk file-based routing. Struktur folder di `pages/` mempengaruhi routes yang di-generate. Saat ini halaman masih berupa single file, perlu diubah ke folder-based untuk konsistensi.

### Constraints
- `vite-plugin-pages` mendukung kedua format: `page.jsx` dan `page/index.jsx`
- Folder-based structure memungkinkan penambahan file pendukung (co-located components, styles)

## Goals / Non-Goals

### Goals
- Setiap halaman menjadi folder dengan `index.jsx`
- Struktur folder mencerminkan hierarki menu sidebar
- Page generator script menghasilkan struktur folder yang benar

### Non-Goals
- Mengubah fungsionalitas fitur yang ada
- Menambah fitur baru
- Mengubah tampilan UI

## Decisions

### 1. Struktur Folder Baru

**Current:**
```
pages/tools/
├── notebook.jsx      → /tools/notebook
├── todo.jsx          → /tools/todo
└── image-splitter.jsx → /tools/image-splitter
```

**Proposed:**
```
pages/tools/
├── productivity/
│   ├── notebook/
│   │   └── index.jsx → /tools/productivity/notebook
│   └── todo/
│       └── index.jsx → /tools/productivity/todo
└── utilities/
    └── image-splitter/
        └── index.jsx → /tools/utilities/image-splitter
```

### 2. URL Changes

| Old URL | New URL |
|---------|---------|
| `/tools/notebook` | `/tools/productivity/notebook` |
| `/tools/todo` | `/tools/productivity/todo` |
| `/tools/image-splitter` | `/tools/utilities/image-splitter` |

### 3. Page Generator Update

Update `scripts/make-page.js`:
- Input: `yarn make:page tools/productivity/notebook`
- Output: `src/pages/tools/productivity/notebook/index.jsx`

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Broken bookmarks | Aplikasi internal, minimal impact |
| Import path changes | Update semua references dalam satu commit |

## Migration Plan

1. Update `make-page.js` script
2. Reorganisasi `pages/tools/` ke struktur folder baru
3. Update paths di `Sidebar.jsx`
4. Test navigasi manual
