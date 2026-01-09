# Proposal: Add Sticky Header Navigation

## Summary
Membuat navigation header selalu mengapung (sticky/fixed) di bagian atas halaman sehingga user dapat mengakses navigasi kapan saja tanpa perlu scroll ke atas. Menyesuaikan posisi konten agar tidak tertutup oleh header.

## Problem
Saat ini, header navigation adalah bagian dari normal document flow - ketika user scroll ke bawah, header akan ikut hilang dari viewport. Ini menyulitkan akses ke fitur-fitur penting seperti:
- Menu toggle (hamburger button)
- Search
- Theme toggle
- Profile/logout

## Proposed Solution
1. Membuat header menjadi `sticky` atau `fixed` di bagian atas viewport
2. Menambahkan padding/margin pada konten utama agar tidak tertutup header
3. Memastikan z-index yang tepat agar header selalu di atas konten lain
4. Mendukung tampilan mobile dan desktop dengan responsif

## Goals
- [x] Header selalu visible saat scroll
- [x] Konten tidak tertutup header
- [x] Transisi smooth saat scroll
- [x] Responsif untuk mobile dan desktop
- [x] Konsisten dengan dark mode

## Non-Goals
- Tidak mengubah struktur sidebar
- Tidak menambah fitur baru ke header

## Scope
- **Files affected**:
  - `frontend/src/components/MainLayout.jsx` - Restructure layout for sticky header
  - `frontend/src/components/Header.jsx` - Add sticky positioning styles

## Implementation Approach
1. Wrap header dalam container dengan `position: sticky` atau `position: fixed`
2. Set `top: 0` dan `z-index` tinggi
3. Tambahkan `padding-top` pada main content area sesuai tinggi header
4. Tambahkan shadow/border pada header untuk visual separation saat scroll
