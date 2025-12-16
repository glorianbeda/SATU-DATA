# Optimize Navigation Performance

## Problem Statement

Saat pindah halaman di React app, UI terasa **freeze** beberapa detik meskipun URL sudah berubah. Masalah ini terjadi baik di development maupun production mode.

## Root Cause Analysis

Setelah inspeksi kode, ditemukan 4 penyebab utama:

| Issue | File | Impact |
|-------|------|--------|
| Heavy components re-render setiap navigasi | `Sidebar.jsx`, `Header.jsx` | Tidak pakai `React.memo`, re-render selalu terjadi |
| Profile re-fetch setiap path change | `MainLayout.jsx` | useEffect dependency `location.pathname` trigger fetch ulang |
| StrictMode double-render (dev only) | `main.jsx` | Semua komponen render 2x di development |
| ~25 komponen pakai `useTranslation()` | Multiple files | i18n context change trigger re-render cascade |

## Proposed Solution

1. **Memoize heavy layout components** (`Sidebar`, `Header`) dengan `React.memo`
2. **Optimize profile fetching** - hapus dependency `location.pathname` yang tidak perlu
3. **Add conditional StrictMode** - disable di development untuk testing, enable di production build check
4. **Memoize menu items** - gunakan `useMemo` untuk array menu yang statis

## Expected Outcome

- Navigation tanpa freeze di dev dan production
- Reduced re-renders dari ~25+ ke minimal yang diperlukan
- Smoother UX saat pindah halaman

## Scope

- Frontend only (`frontend/src/components/`)
- No backend changes
- No breaking changes

---

## Security: React Upgrade (CVE-2025-55182)

### Current Status
- **React version**: 19.2.0 (VULNERABLE)
- **RSC usage**: ❌ NOT USED (project uses `@vitejs/plugin-react` for client-side rendering)

### Vulnerability Details

| CVE | CVSS | Impact | Fixed In |
|-----|------|--------|----------|
| CVE-2025-55182 | 10.0 (Critical) | RCE via RSC | 19.0.1, 19.1.2, 19.2.1 |
| CVE-2025-55184 | 7.5 (High) | DoS infinite loop | 19.0.3, 19.1.4, 19.2.3 |
| CVE-2025-67779 | 7.5 (High) | DoS (incomplete fix) | 19.0.3, 19.1.4, 19.2.3 |
| CVE-2025-55183 | 5.3 (Medium) | Source code exposure | 19.0.3, 19.1.4, 19.2.3 |

**Affected packages:** `react-server-dom-webpack`, `react-server-dom-parcel`, `react-server-dom-turbopack`

### Risk Assessment
Project ini **TIDAK menggunakan RSC** karena:
1. Menggunakan Vite dengan `@vitejs/plugin-react` (client-side only)
2. Tidak ada `@vitejs/plugin-rsc` di dependencies
3. Tidak ada Server Components (`"use server"`) di codebase

**Risk Level: LOW** - Tidak langsung terpengaruh, tapi upgrade direkomendasikan.

### Action Items
1. Upgrade `react` dan `react-dom` ke **19.2.3** (fully patched)
2. Dokumentasikan bahwa project ini TIDAK boleh menggunakan RSC
3. Update `@types/react` dan `@types/react-dom`
